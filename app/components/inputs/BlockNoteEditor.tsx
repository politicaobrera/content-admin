'use client';

import { debounce } from 'lodash'
import { filterSuggestionItems, insertOrUpdateBlock } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote, SuggestionMenuController, DefaultReactSuggestionItem, getDefaultReactSlashMenuItems } from '@blocknote/react';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';
import BlockNoteEditorSchema from './BlockNoteEditorSchema';
import { useCallback } from 'react';
  
interface BlockNoteEditorProps {
  initial?: any[];
  onChange: (html: string) => void;
}

export default function BlockNoteEditor({ initial = [], onChange }: BlockNoteEditorProps) {

  const insertIframe = () => ({
    title: "Insert Iframe",
    onItemClick: () => {
      const url = window.prompt('Enter the URL to embed:');
      if (!url) return; // cancelado
      insertOrUpdateBlock(editor, {
        type: "iframe",
        props:{url}
      })
    },
    aliases: ["iframe", "embed", "video", "youtube", "vimeo", "contenido"],
    group: "Media",
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
    initialContent: initial.length ? initial : undefined,
    schema: BlockNoteEditorSchema,
  });

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
    <BlockNoteView
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
  ) 
}