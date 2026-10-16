import { getYouTubeEmbedUrl } from "@/app/utils/youtube"

interface VideoPreviewPlayerProps {
  url?: string
  title?: string
}

// Muestra un preview en vivo de lo que va a verse en el carrousel del sitio: si la URL
// es de YouTube se embebe el player, si no se asume un archivo de video propio y se
// intenta reproducir directo. Si no hay URL todavía, se muestra un placeholder.
const VideoPreviewPlayer = ({ url, title }: VideoPreviewPlayerProps) => {
  const trimmedUrl = url?.trim()

  if (!trimmedUrl) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-md bg-gray-100 text-sm text-gray-400">
        Sin video
      </div>
    )
  }

  const embedUrl = getYouTubeEmbedUrl(trimmedUrl)

  return (
    <div className="aspect-video w-full overflow-hidden rounded-md bg-black">
      {embedUrl ? (
        <iframe
          key={embedUrl}
          src={embedUrl}
          title={title || "preview"}
          className="h-full w-full"
          frameBorder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          key={trimmedUrl}
          src={trimmedUrl}
          controls
          className="h-full w-full"
          onError={(e) => {
            // Si el archivo no es un video reproducible (ni tampoco YouTube), no mostramos
            // nada roto: ocultamos el elemento y queda el fondo negro como indicador neutro.
            e.currentTarget.style.display = "none"
          }}
        />
      )}
    </div>
  )
}

export default VideoPreviewPlayer
