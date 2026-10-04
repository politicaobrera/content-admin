'use client'

import Tabs from "@/app/components/layout/Tabs"

interface PortadaTabsProps {
  articlesTab: React.ReactNode
  layoutsTab: React.ReactNode
}

const PortadaTabs = ({ articlesTab, layoutsTab }: PortadaTabsProps) => {
  return (
    <Tabs
      tabs={[
        { id: "articulos", label: "Artículos", content: articlesTab },
        { id: "diseno", label: "Diseño de portada", content: layoutsTab },
      ]}
    />
  )
}

export default PortadaTabs
