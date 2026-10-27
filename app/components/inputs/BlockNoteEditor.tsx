'use client';

import { debounce } from 'lodash'
import { BlockNoteView } from '@blocknote/mantine';
import {
  useCreateBlockNote,
  SuggestionMenuController,
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
} from '@blocknote/react';
import { filterSuggestionItems, insertOrUpdateBlockForSlashMenu } from '@blocknote/core/extensions';
import { TextSelection } from 'prosemirror-state';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';
import BlockNoteEditorSchema, { detectSocialProvider } from './BlockNoteEditorSchema';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';

interface BlockNoteEditorProps {
  id: string,
  initial?: any[];
  initialHTML?: string;
  onChange: (html: string) => void;
}

export type InsertableMediaBlockType = "image" | "video" | "audio";

export interface BlockNoteEditorHandle {
  // inserta despues del ultimo bloque donde el cursor estuvo parado (rastreado via
  // onSelectionChange, porque el foco ya se perdio para cuando se hace click en el
  // boton "insertar en el cuerpo" del panel de recursos) -- si nunca hubo foco
  // registrado, inserta al final del documento.
  insertMediaBlock: (type: InsertableMediaBlockType, url: string, caption?: string) => void;
  // crea un link a `url` en el punto donde estaba el cursor/seleccion por ultima vez
  // (rastreado via onSelectionChange, mismo motivo que arriba). Si habia texto
  // seleccionado, ese texto se convierte en el link; si no, se usa `fallbackText`
  // (el titulo de la nota vinculada) como texto del link.
  insertArticleLink: (url: string, fallbackText: string) => void;
}

const BlockNoteEditor = forwardRef<BlockNoteEditorHandle, BlockNoteEditorProps>(function BlockNoteEditor(
  { id, initialHTML, initial = [], onChange },
  ref,
) {

  const editor = useCreateBlockNote({
    schema: BlockNoteEditorSchema,
    domAttributes: {
      editor: {
        style: 'min-height: 200px;',
      },
    }
  });

  // ultimo bloque donde el cursor estuvo parado dentro del editor -- se actualiza en
  // cada cambio de seleccion, asi sigue disponible aunque el foco haya pasado al panel
  // de recursos (de otro componente) para cuando se haga click en insertar
  const lastFocusedBlockId = useRef<string | null>(null);

  // ultima seleccion de texto (posiciones ProseMirror), para poder restaurarla y
  // convertirla en link despues de que el foco haya pasado al panel de notas
  // relacionadas -- BlockNote no tiene un equivalente de seleccion por caracteres
  // a nivel de su API de bloques, por eso se opera directo sobre prosemirrorView
  const lastTextSelection = useRef<{ from: number; to: number } | null>(null);

  useEffect(() => {
    return editor.onSelectionChange(() => {
      lastFocusedBlockId.current = editor.getTextCursorPosition().block.id;
      const { from, to } = editor.prosemirrorView.state.selection;
      lastTextSelection.current = { from, to };
    });
  }, [editor]);

  useImperativeHandle(ref, () => ({
    insertMediaBlock: (type, url, caption) => {
      const newBlock = { type, props: { url, caption: caption ?? "" } };
      const targetBlockId = lastFocusedBlockId.current;
      const blocks = editor.document;
      const lastBlock = blocks[blocks.length - 1];

      if (targetBlockId && blocks.some((b) => b.id === targetBlockId)) {
        editor.insertBlocks([newBlock], targetBlockId, "after");
      } else if (lastBlock) {
        editor.insertBlocks([newBlock], lastBlock.id, "after");
      } else {
        editor.insertBlocks([newBlock], blocks[0]?.id ?? "");
      }
    },
    insertArticleLink: (url, fallbackText) => {
      const selection = lastTextSelection.current;
      const docSize = editor.prosemirrorView.state.doc.content.size;
      const hasValidSelection = selection && selection.from !== selection.to
        && selection.to <= docSize;

      if (hasValidSelection) {
        editor.transact((tr) => {
          tr.setSelection(TextSelection.create(tr.doc, selection.from, selection.to));
        });
        editor.createLink(url);
        return;
      }

      // sin seleccion de texto: paramos en el ultimo bloque enfocado (o el final del
      // documento) e insertamos el titulo de la nota como texto del link
      const targetBlockId = lastFocusedBlockId.current;
      const blocks = editor.document;
      const lastBlock = blocks[blocks.length - 1];
      const placementBlock = targetBlockId && blocks.some((b) => b.id === targetBlockId)
        ? targetBlockId
        : lastBlock?.id;

      if (placementBlock) {
        editor.setTextCursorPosition(placementBlock, "end");
      }
      editor.createLink(url, fallbackText);
    },
  }), [editor]);

  const insertIframe = (editor: typeof BlockNoteEditorSchema.BlockNoteEditor) => ({
    title: "Insertar embed",
    onItemClick: () => {
      const url = window.prompt('Pegá la URL a embeber (YouTube, Vimeo, etc.):');
      if (!url) return; // cancelado
      insertOrUpdateBlockForSlashMenu(editor, {
        type: "iframe",
        props: { src: url },
      });
    },
    aliases: ["iframe", "embed", "video", "youtube", "vimeo", "contenido"],
    group: "Custom",
    icon: <div style={{ width: 18, height: 18 }}>🎥</div>,
    subtext: "Insertar contenido embebido externo.",
  });

  const insertSocialEmbed = (editor: typeof BlockNoteEditorSchema.BlockNoteEditor) => ({
    title: "Insertar post de red social",
    onItemClick: () => {
      const url = window.prompt('Pegá el link del post (X/Twitter, Facebook o Instagram):');
      if (!url) return; // cancelado
      const provider = detectSocialProvider(url);
      if (!provider) {
        window.alert('Esa URL no parece ser de X (Twitter), Facebook o Instagram.');
        return;
      }
      insertOrUpdateBlockForSlashMenu(editor, {
        type: "social-embed",
        props: { provider, url },
      });
    },
    aliases: ["twitter", "x", "tweet", "facebook", "instagram", "social"],
    group: "Custom",
    icon: <div style={{ width: 18, height: 18 }}>📱</div>,
    subtext: "Insertar un post de X/Twitter, Facebook o Instagram embebido.",
  });

  const getCustomSlashMenuItems = (
    editor: typeof BlockNoteEditorSchema.BlockNoteEditor,
  ): DefaultReactSuggestionItem[] => [
    ...getDefaultReactSlashMenuItems(editor),
    insertIframe(editor),
    insertSocialEmbed(editor),
  ];

  useEffect(() => {
    async function loadInitial() {
      if (initial.length) {
        editor.replaceBlocks(editor.document, initial);
        return
      }
      if (initialHTML) {
        const blocks = await editor.tryParseHTMLToBlocks(initialHTML);
        editor.replaceBlocks(editor.document, blocks);
      }
    }
    loadInitial();
  }, [editor]);

  const handleChange = useCallback(
    debounce(async () => {
      try {
        const html = await editor.blocksToHTMLLossy();
        onChange?.(html.replace(/<p><\/p>/g, '<p>&nbsp;</p>'));
      } catch (e) {
        console.error(e);
      }
    }, 500),
    [onChange]
  );

  return (
    <div>
      <div className="prose prose-a:text-blue-400 prose-a:font-semibold prose-a:no-underline hover:prose-a:text-blue-300">
        <BlockNoteView
          id={id}
          editor={editor}
          theme="light"
          onChange={handleChange}
          slashMenu={false}
        >
          <SuggestionMenuController
            triggerCharacter={"/"}
            getItems={async (query) =>
              filterSuggestionItems(getCustomSlashMenuItems(editor), query)
            }
          />
        </BlockNoteView>
      </div>
      {/* <style>{`
          .bn-editor a {
            color: #60a5fa !important;
            text-decoration: underline !important;
            text-decoration-thickness: 2px !important;
            text-underline-offset: 2px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
          }
          .bn-editor a:hover {
            color: #93bbfc !important;
            text-decoration-thickness: 3px !important;
            text-underline-offset: 3px !important;
          }
        `}</style>       */}
    </div>
  )
});

export default BlockNoteEditor;