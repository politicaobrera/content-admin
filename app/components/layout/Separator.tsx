interface SeparatorProps {
  label?: string,
  // heading: encabezado destacado tipo <h2> en vez de la línea divisoria chica
  heading?: boolean,
}

const Separator: React.FC<SeparatorProps> = ({
  label,
  heading = false,
}) => {
  if (heading && label) {
    return (
      <div className="mt-8">
        <h2
          className="
            text-lg
            font-bold
            text-gray-900
            uppercase
            tracking-wide
            pb-2
            border-b-2
            border-gray-400
          "
        >
          {label}
        </h2>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="relative">
        <div
          className="
            absolute
            inset-0
            flex
            items-center
          "
        >
          <div
            className="
              w-full
              border-t-2
              border-gray-400
            "
          />
        </div>
        <div className="
          relative
          flex
          justify-center
          text-sm
          "
        >
          <span className="
            bg-white
            px-2
            text-gray-500
            "
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Separator