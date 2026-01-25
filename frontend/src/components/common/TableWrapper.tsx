type Props = {
  title: string
  children: React.ReactNode
}

export default function TableWrapper({ title, children }: Props) {
  return (
    <div className="border rounded-xl overflow-hidden bg-background">
      <div className="px-4 py-3 border-b font-semibold">{title}</div>
      <div className="w-full overflow-auto">{children}</div>
    </div>
  )
}
