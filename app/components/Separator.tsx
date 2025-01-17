interface SeparatorProps {
  label?: string,
}

const Separator: React.FC<SeparatorProps> = ({
  label
}) => {
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