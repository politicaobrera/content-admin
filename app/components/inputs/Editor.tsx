'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';

interface Props {
  initial?: any[];
  onChange: (html: string) => void;
}

export default function Editor({ initial = [], onChange }: Props) {
  const editor = useCreateBlockNote({
    initialContent: initial.length ? initial : undefined,
    
  });

  const handleChange = async () => {
    // TODO: in the future handle this in more intelligent way? preprocessing or adding blocks?
    const html = await editor.blocksToHTMLLossy();
    onChange(html);
  };

  return <BlockNoteView editor={editor} theme="light" onChange={handleChange}/>;
}
// "use client";
// import "@blocknote/core/fonts/inter.css";
// import { useCreateBlockNote } from "@blocknote/react";
// import { BlockNoteView } from "@blocknote/mantine";
// import "@blocknote/mantine/style.css";
// // Our <Editor> component we can reuse later
// export default function Editor() {
//   // Creates a new editor instance.
//   if(!document) return <></>

//   const editor = useCreateBlockNote();
//   // Renders the editor instance using a React component.
//   return <BlockNoteView editor={editor} />;
// }