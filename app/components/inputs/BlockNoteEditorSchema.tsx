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
    instgrm?: {
      Embeds: { process: (el?: HTMLElement) => void };
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

// Pese a ser el mismo dueño (Meta), Facebook e Instagram usan SDKs de embed
// completamente independientes -- uno NO hidrata los bloques del otro.
function loadFacebookWidgets() {
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

function loadInstagramWidgets() {
  if (window.instgrm) {
    window.instgrm.Embeds.process();
    return;
  }
  const existing = document.getElementById('instagram-embed-js');
  if (existing) return;

  const script = document.createElement('script');
  script.id = 'instagram-embed-js';
  script.src = 'https://www.instagram.com/embed.js';
  script.async = true;
  document.body.appendChild(script);
}

// Dispara el SDK que corresponda según lo que reconozca en el HTML pegado. Usado por
// raw-embed (ver abajo): cuando el modo "pegar URL" de social-embed no alcanza (la App
// de Facebook en modo Development bloquea fb-post por URL, por ejemplo), el usuario
// puede pegar directamente el snippet de embed oficial ("Insertar código de inserción")
// que cada red ofrece, y este detecta cuál SDK hidratarlo.
function loadWidgetsForRawEmbed(html: string) {
  if (html.includes('twitter-tweet')) loadTwitterWidgets();
  if (html.includes('fb-post') || html.includes('fb-video')) loadFacebookWidgets();
  if (html.includes('instagram-media')) loadInstagramWidgets();
}

// Reconoce únicamente embeds de redes conocidas (o un <iframe> ya armado) -- no cualquier
// HTML. No es una sanitización contra XSS (igual que el resto del `content` de la nota,
// este HTML solo lo escriben editores autenticados del CMS, nunca visitantes públicos),
// es solo para evitar que alguien pegue por error texto/HTML no relacionado y rompa el layout.
function looksLikeKnownEmbed(html: string): boolean {
  return /twitter-tweet|fb-post|fb-video|instagram-media|<iframe/i.test(html);
}

export const rawEmbedBlockSpec = createReactBlockSpec(
  {
    type: 'raw-embed',
    propSchema: {
      html: {
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
        if (block.props.html) {
          loadWidgetsForRawEmbed(block.props.html);
        }
      }, [block.props.html]);

      if (!block.props.html) {
        return (
          <div style={{ padding: 16, textAlign: 'center', opacity: 0.6 }}>
            Sin código de embed configurado
          </div>
        );
      }

      return (
        <div
          ref={containerRef}
          style={{ margin: '16px 0' }}
          contentEditable={false}
          dangerouslySetInnerHTML={{ __html: block.props.html }}
        />
      );
    },
    // Se persiste tal cual lo pegó el usuario, envuelto en un marcador propio para que
    // `parse` pueda reconocer este bloque sin confundirlo con un social-embed/iframe sueltos
    // insertados por los otros bloques.
    toExternalHTML: (props) => (
      <div
        className="raw-embed"
        dangerouslySetInnerHTML={{ __html: props.block.props.html }}
      />
    ),
    parse: (element: HTMLElement) => {
      if (element.classList.contains('raw-embed')) {
        return { html: element.innerHTML };
      }
      return undefined;
    },
  }
);

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
        if (block.props.provider === 'facebook' && block.props.url) {
          loadFacebookWidgets();
        }
        if (block.props.provider === 'instagram' && block.props.url) {
          loadInstagramWidgets();
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
    'raw-embed': rawEmbedBlockSpec(),
  },
});

export default BlockNoteEditorSchema;