'use client'

import { useState } from "react"
import clsx from "clsx"

export interface TabDef {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: TabDef[]
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeId, setActiveId] = useState(tabs[0]?.id)
  const activeTab = tabs.find((tab) => tab.id === activeId)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2 border-b-2 border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveId(tab.id)}
            className={clsx(
              "px-4 py-2 font-bold text-lg -mb-[2px] border-b-2",
              tab.id === activeId
                ? "border-gray-800 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab?.content}
    </div>
  )
}

export default Tabs
