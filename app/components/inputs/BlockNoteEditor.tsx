'use client';

import { debounce } from 'lodash'
import { filterSuggestionItems, insertOrUpdateBlock } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote, SuggestionMenuController, DefaultReactSuggestionItem, getDefaultReactSlashMenuItems } from '@blocknote/react';
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

  const insertIframe = () => ({
    title: "Insert Iframe",
    onItemClick: () => {
      const url = window.prompt('Enter the URL to embed:');
      if (!url) return; // cancelado
      insertOrUpdateBlock(editor, {
        type: "iframe",
        props:{src:url}
      })
    },
    aliases: ["iframe", "embed", "video", "youtube", "vimeo", "contenido"],
    group: "Custom",
    icon: <div style={{ width: 18, height: 18 }}>🎥</div>,
    subtext: "Insertar contenido embebido externo.",
  });

  const getCustomSlashMenuItems = (
    editor: any,
  ): DefaultReactSuggestionItem[] => [
    ...getDefaultReactSlashMenuItems(editor),
    insertIframe(),
  ];

  const editor = useCreateBlockNote({
    //initialContent: initial.length ? initial : undefined,
    schema: BlockNoteEditorSchema,
  });

  useEffect(() => {
    async function loadInitial() {
      if(initial.length) {
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
        console.log("editor document", editor.document)
      } catch (e) {
        console.error(e);
      }
    }, 500),
    [onChange]
  );

  return (
    <div>
      <label
        className="
          block
          text-sm
          text-gray-900
          font-medium
          leading-6
        "
        htmlFor={id}
      >
        {label}
      </label>
      <div>
        <BlockNoteView
          id={id}
          editor={editor}
          theme="dark"
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
    </div>
  ) 
}