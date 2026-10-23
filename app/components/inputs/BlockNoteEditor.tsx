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
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';
import BlockNoteEditorSchema from './BlockNoteEditorSchema';
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

  useEffect(() => {
    return editor.onSelectionChange(() => {
      lastFocusedBlockId.current = editor.getTextCursorPosition().block.id;
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

  const getCustomSlashMenuItems = (
    editor: typeof BlockNoteEditorSchema.BlockNoteEditor,
  ): DefaultReactSuggestionItem[] => [
    ...getDefaultReactSlashMenuItems(editor),
    insertIframe(editor),
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