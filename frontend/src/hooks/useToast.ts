import { useCallback, useState } from "react"

type ToastData = {
  title: string
  description?: string
}

export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null)

  const showToast = useCallback((data: ToastData) => {
    setToast(data)
    setTimeout(() => setToast(null), 2500)
  }, [])

  return { toast, showToast }
}
