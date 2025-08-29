import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { createReactBlockSpec } from '@blocknote/react';
import { defaultProps } from '@blocknote/core';

export const iframeBlockSpec = createReactBlockSpec(
  {
    type: 'iframe',
    propSchema: {
      src: {
        default: '',
      },
      width: {
        default: '100%',
      },
      height: {
        default: '400px',
      },
      ...defaultProps,
    },
    content: 'none',
  },
  {
    render: (props:any) => {
      const { block } = props;
      
      return (
        <div style={{ margin: '16px 0', width: '100%' }}>
          <iframe
            src={block.props.src}
            width={block.props.width}
            height={block.props.height}
            style={{
              border: 'none',
              borderRadius: '8px',
              maxWidth: '100%',
            }}
            allowFullScreen
          />
        </div>
      );
    },
    parse: (element: HTMLElement) => {
      if (element.tagName === "IFRAME") {
        return {
          src: element.getAttribute("src") || "www.example.com",
          width: element.getAttribute("width") || "100%",
          height: element.getAttribute("height") || "400px",
        };
      }
      return undefined;
    },
  }
);

// Create the schema including your custom embed block
const BlockNoteEditorSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    iframe: iframeBlockSpec,
  },
});

export default BlockNoteEditorSchema

// To insert:
// editor.insertBlocks([
//   {
//     type: "embed",
//     props: {
//       url: "https://example.com/your-embedded-content",
//     },
//   },
// ]);