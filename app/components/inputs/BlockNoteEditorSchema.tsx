import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { createReactBlockSpec } from '@blocknote/react';
import { defaultProps } from '@blocknote/core';

export const iframeBlockSpec = createReactBlockSpec(
  {
    type: 'iframe',
    propSchema: {
      url: {
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
        <div style={{ margin: '16px 0' }}>
          <iframe
            src={block.props.url}
            width={block.props.width}
            height={block.props.height}
            style={{
              border: 'none',
              borderRadius: '8px',
              maxWidth: '100%',
            }}
            allowFullScreen
            title="Embedded content"
          />
        </div>
      );
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