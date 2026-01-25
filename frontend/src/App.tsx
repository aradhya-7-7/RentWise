import AppRoutes from "@/app/routes"
import AppProviders from "@/app/providers"

import { ToastProvider, ToastViewport } from "@/components/ui/toast"

export default function App() {
  return (
    <ToastProvider>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
      <ToastViewport />
    </ToastProvider>
  )
}
