import type { ReactNode } from "react"

export default function TableWrapper({
  title,
  actions,
  children,
}: {
  title: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {actions}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="[&_table]:w-full [&_th]:text-left [&_th]:px-4 [&_th]:py-3 [&_th]:text-xs [&_th]:font-medium [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-white/60
                        [&_td]:px-4 [&_td]:py-3 [&_td]:text-sm [&_td]:text-white/80
                        [&_tbody_tr]:border-t [&_tbody_tr]:border-white/10
                        [&_tbody_tr:hover]:bg-white/5
                        [&_thead]:bg-white/5">
          {children}
        </div>
      </div>
    </div>
  )
}
