import { MainImageType } from "@/app/types/image"

interface ImageThumbProps {
  image: MainImageType | undefined
}

const ImageThumb = ({image}: ImageThumbProps) => {
  return (
    <>
      {image && (
        <>
          <img
            src={image?.src}
            alt={image?.caption}
            className="h-auto w-24 object-cover"
          />
        </>
      )}
      {!image && (
        <div className="w-24 h-auto bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-auto w-24 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </>
 )
}

export default ImageThumb