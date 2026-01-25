type Status =
  | "PAID"
  | "PENDING"
  | "OVERDUE"
  | "RESOLVED"
  | "IN_PROGRESS"
  | "URGENT"

export default function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    PAID: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    OVERDUE: "bg-red-100 text-red-700",
    RESOLVED: "bg-green-100 text-green-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    URGENT: "bg-red-100 text-red-700",
  }

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  )
}
