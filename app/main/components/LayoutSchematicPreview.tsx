import clsx from "clsx"

interface LayoutSchematicPreviewProps {
  slug: string
  label: string
}

const BOX = "bg-gray-300 border border-gray-500 rounded-sm"

// Representación esquemática mínima de cada layout: bloques con proporciones
// aproximadas a su disposición real en MUI, sin intentar clonar el diseño exacto.
function LayoutBoxes({ slug }: { slug: string }) {
  switch (slug) {
    case "hero-grid-11":
      return (
        <div className="flex flex-col gap-1 w-full">
          <div className="flex gap-1"><div className={clsx(BOX, "h-6 w-1/2")} /><div className={clsx(BOX, "h-6 w-1/2")} /></div>
          <div className="flex gap-1"><div className={clsx(BOX, "h-6 w-1/2")} /><div className={clsx(BOX, "h-6 w-1/2")} /></div>
          <div className={clsx(BOX, "h-10 w-full")} />
          <div className="flex gap-1">
            <div className={clsx(BOX, "h-6 w-1/3")} /><div className={clsx(BOX, "h-6 w-1/3")} /><div className={clsx(BOX, "h-6 w-1/3")} />
          </div>
        </div>
      )
    case "headline-trio-4":
      return (
        <div className="flex flex-col gap-1 w-full">
          <div className={clsx(BOX, "h-8 w-full")} />
          <div className="flex gap-1">
            <div className={clsx(BOX, "h-6 w-1/3")} /><div className={clsx(BOX, "h-6 w-1/3")} /><div className={clsx(BOX, "h-6 w-1/3")} />
          </div>
        </div>
      )
    case "duo-strip-7":
      return (
        <div className="flex flex-col gap-1 w-full">
          <div className="flex gap-1"><div className={clsx(BOX, "h-8 w-1/2")} /><div className={clsx(BOX, "h-8 w-1/2")} /></div>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className={clsx(BOX, "h-5 flex-1")} />)}
          </div>
        </div>
      )
    case "photo-strip-5":
      return (
        <div className="flex flex-col gap-1 w-full">
          <div className="flex gap-1"><div className={clsx(BOX, "h-7 w-1/2")} /><div className={clsx(BOX, "h-7 w-1/2")} /></div>
          <div className="flex gap-1">
            <div className={clsx(BOX, "h-6 w-1/3")} /><div className={clsx(BOX, "h-6 w-1/3")} /><div className={clsx(BOX, "h-6 w-1/3")} />
          </div>
        </div>
      )
    case "magazine-spread-6":
      return (
        <div className="flex flex-col gap-1 w-full">
          <div className="flex gap-1">
            <div className={clsx(BOX, "h-10 w-2/3")} />
            <div className="flex flex-col gap-1 w-1/3">
              <div className={clsx(BOX, "h-[18px] w-full")} />
              <div className={clsx(BOX, "h-[18px] w-full")} />
            </div>
          </div>
          <div className="flex gap-1">
            <div className={clsx(BOX, "h-6 w-1/3")} /><div className={clsx(BOX, "h-6 w-1/3")} /><div className={clsx(BOX, "h-6 w-1/3")} />
          </div>
        </div>
      )
    default:
      return <div className={clsx(BOX, "h-8 w-full")} />
  }
}

function LayoutSchematicPreview({ slug, label }: LayoutSchematicPreviewProps) {
  return (
    <div className="flex flex-col gap-1 border-2 border-gray-300 rounded-md p-2 bg-gray-50">
      <div className="text-xs font-semibold text-gray-700">{label}</div>
      <LayoutBoxes slug={slug} />
    </div>
  )
}

export default LayoutSchematicPreview
