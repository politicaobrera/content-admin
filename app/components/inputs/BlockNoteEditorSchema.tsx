import { BlockNoteSchema, defaultBlockSpecs, defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from '@blocknote/react';

// Convierte URLs "normales" de YouTube/Vimeo en su versión embebible.
// Si no matchea nada conocido, devuelve la URL tal cual (para iframes genéricos).
function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);

    // youtube.com/watch?v=XXXX  o  youtu.be/XXXX
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }
    // youtube.com/embed/XXXX -> ya está bien
    if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/embed/')) {
      return url;
    }

    // vimeo.com/XXXXXXX
    if (u.hostname.includes('vimeo.com') && !u.pathname.includes('/video/')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      return `https://player.vimeo.com/video/${id}`;
    }

    return url;
  } catch {
    return url;
  }
}

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
    render: (props) => {
      const { block } = props;

      if (!block.props.src) {
        return (
          <div style={{ padding: 16, textAlign: 'center', opacity: 0.6 }}>
            Sin URL configurada
          </div>
        );
      }

      return (
        <div style={{ margin: '16px 0', width: '100%' }} contentEditable={false}>
          <iframe
            src={toEmbedUrl(block.props.src)}
            width={block.props.width}
            height={block.props.height}
            style={{
              border: 'none',
              borderRadius: '8px',
              maxWidth: '100%',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    },
    parse: (element: HTMLElement) => {
      if (element.tagName === "IFRAME") {
        return {
          src: element.getAttribute("src") || "",
          width: element.getAttribute("width") || "100%",
          height: element.getAttribute("height") || "400px",
        };
      }
      return undefined;
    },
  }
);

const BlockNoteEditorSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    iframe: iframeBlockSpec(), 
  },
});

export default BlockNoteEditorSchema;