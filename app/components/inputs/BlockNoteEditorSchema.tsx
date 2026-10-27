import React from 'react';
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

// Detecta a qué red social pertenece la URL pegada, para un bloque `social-embed`
// que sabe renderizar el snippet oficial de cada una (a diferencia de YouTube/Vimeo,
// estas redes no exponen una URL de iframe embebible directa).
export type SocialProvider = 'twitter' | 'facebook' | 'instagram';

export function detectSocialProvider(url: string): SocialProvider | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    if (host === 'twitter.com' || host === 'x.com') return 'twitter';
    if (host === 'facebook.com' || host === 'fb.watch') return 'facebook';
    if (host === 'instagram.com') return 'instagram';
    return null;
  } catch {
    return null;
  }
}

// App ID reusado del sitio legacy (ya autorizado para el dominio del sitio en Meta for
// Developers, donde se usaba para fb-comments)
const FACEBOOK_APP_ID = '199305801968053';

declare global {
  interface Window {
    twttr?: {
      widgets: { load: (el?: HTMLElement) => void };
    };
    FB?: {
      XFBML: { parse: (el?: HTMLElement) => void };
    };
  }
}

// Carga el script de widgets de Twitter/X una sola vez por página (si ya está
// presente, solo re-dispara el load para que hidrate los blockquotes nuevos).
function loadTwitterWidgets() {
  if (window.twttr) {
    window.twttr.widgets.load();
    return;
  }
  const existing = document.getElementById('twitter-wjs');
  if (existing) return;

  const script = document.createElement('script');
  script.id = 'twitter-wjs';
  script.src = 'https://platform.twitter.com/widgets.js';
  script.async = true;
  document.body.appendChild(script);
}

// El SDK de Meta hidrata tanto fb-post (Facebook) como instagram-media (Instagram)
function loadMetaWidgets() {
  if (window.FB) {
    window.FB.XFBML.parse();
    return;
  }
  const existing = document.getElementById('facebook-jssdk');
  if (existing) return;

  const script = document.createElement('script');
  script.id = 'facebook-jssdk';
  script.src = `https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v19.0&appId=${FACEBOOK_APP_ID}&autoLogAppEvents=1`;
  script.async = true;
  script.defer = true;
  script.crossOrigin = 'anonymous';
  document.body.appendChild(script);
}

export const socialEmbedBlockSpec = createReactBlockSpec(
  {
    type: 'social-embed',
    propSchema: {
      provider: {
        default: 'twitter',
      },
      url: {
        default: '',
      },
      ...defaultProps,
    },
    content: 'none',
  },
  {
    render: (props) => {
      const { block } = props;
      const containerRef = React.useRef<HTMLDivElement>(null);

      React.useEffect(() => {
        if (block.props.provider === 'twitter' && block.props.url) {
          loadTwitterWidgets();
        }
        if ((block.props.provider === 'facebook' || block.props.provider === 'instagram') && block.props.url) {
          loadMetaWidgets();
        }
      }, [block.props.provider, block.props.url]);

      if (!block.props.url) {
        return (
          <div style={{ padding: 16, textAlign: 'center', opacity: 0.6 }}>
            Sin URL configurada
          </div>
        );
      }

      switch (block.props.provider) {
        case 'twitter':
          return (
            <div ref={containerRef} style={{ margin: '16px 0' }} contentEditable={false}>
              <blockquote className="twitter-tweet">
                <a href={block.props.url}>{block.props.url}</a>
              </blockquote>
            </div>
          );
        case 'facebook':
          return (
            <div ref={containerRef} style={{ margin: '16px 0' }} contentEditable={false}>
              <div className="fb-post" data-href={block.props.url} data-width="500" />
            </div>
          );
        case 'instagram':
          return (
            <div ref={containerRef} style={{ margin: '16px 0' }} contentEditable={false}>
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={block.props.url}
                data-instgrm-version="14"
              >
                <a href={block.props.url}>{block.props.url}</a>
              </blockquote>
            </div>
          );
        default:
          return (
            <div style={{ padding: 16, textAlign: 'center', opacity: 0.6 }}>
              Red social no soportada
            </div>
          );
      }
    },
    // El HTML persistido usa el formato de embed oficial de cada red (data-provider permite
    // reconstruir el bloque al reabrir la nota sin tener que re-detectar el provider, ver `parse`).
    toExternalHTML: (props) => {
      const { block } = props;
      const { provider, url } = block.props;

      if (provider === 'facebook') {
        return <div className="fb-post" data-provider={provider} data-href={url} data-width="500" />;
      }

      if (provider === 'instagram') {
        return (
          <blockquote
            className="instagram-media"
            data-provider={provider}
            data-instgrm-permalink={url}
            data-instgrm-version="14"
          >
            <a href={url}>{url}</a>
          </blockquote>
        );
      }

      return (
        <blockquote className="twitter-tweet" data-provider={provider} data-url={url}>
          <a href={url}>{url}</a>
        </blockquote>
      );
    },
    parse: (element: HTMLElement) => {
      if (element.classList.contains('fb-post')) {
        const url = element.getAttribute('data-href') || '';
        return { provider: 'facebook' as SocialProvider, url };
      }

      if (element.classList.contains('instagram-media')) {
        const url = element.getAttribute('data-instgrm-permalink')
          || element.querySelector('a')?.getAttribute('href')
          || '';
        return { provider: 'instagram' as SocialProvider, url };
      }

      if (element.tagName === "BLOCKQUOTE" && element.classList.contains("twitter-tweet")) {
        const url = element.getAttribute("data-url")
          || element.querySelector("a")?.getAttribute("href")
          || "";
        const provider = (element.getAttribute("data-provider") as SocialProvider | null)
          || detectSocialProvider(url)
          || "twitter";
        return { provider, url };
      }
      return undefined;
    },
  }
);

const BlockNoteEditorSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    iframe: iframeBlockSpec(),
    'social-embed': socialEmbedBlockSpec(),
  },
});

export default BlockNoteEditorSchema;