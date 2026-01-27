import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <Card className="border-white/10 bg-white/5 text-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-base text-white">{title}</CardTitle>
        {subtitle ? (
          <p className="text-sm text-white/60">{subtitle}</p>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
