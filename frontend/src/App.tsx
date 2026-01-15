import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="p-10 space-x-4">
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
}

export default App
