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
import { useCallback, useEffect } from 'react';

interface BlockNoteEditorProps {
  label: string,
  id: string,
  initial?: any[];
  initialHTML?: string;
  onChange: (html: string) => void;
}

export default function BlockNoteEditor({ id, label, initialHTML, initial = [], onChange }: BlockNoteEditorProps) {

  const editor = useCreateBlockNote({
    schema: BlockNoteEditorSchema,
    domAttributes: {
      editor: {
        style: 'min-height: 200px;',
      },
    }
  });

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
        onChange?.(html);
      } catch (e) {
        console.error(e);
      }
    }, 500),
    [onChange]
  );

  return (
    <div>
      <label className="block text-sm text-gray-900 font-medium leading-6" htmlFor={id}>
        {label}
      </label>
      <div className="prose prose-invert prose-a:text-blue-400 prose-a:font-semibold prose-a:no-underline hover:prose-a:text-blue-300">
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
}