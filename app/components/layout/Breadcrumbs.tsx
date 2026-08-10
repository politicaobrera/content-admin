import Link from "next/link"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({items}) => {
  return (
    <nav
      aria-label="breadcrumb"
      className="
        flex
        items-center
        gap-1
        overflow-x-auto
        whitespace-nowrap
        text-sm
        text-gray-600
        mb-2
        mt-5
      "
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1 shrink-0">
            {index > 0 && <span className="text-gray-400">/</span>}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:underline hover:text-black">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-black font-medium" : ""}>{item.label}</span>
            )}
          </span>
        )
      })}
    </nav>
  )
}

export default Breadcrumbs
