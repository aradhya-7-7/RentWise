import AppRoutes from "@/app/routes"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"

export default function App() {
  return (
    <ToastProvider>
      <AppRoutes />
      <ToastViewport />
    </ToastProvider>
  )
}
