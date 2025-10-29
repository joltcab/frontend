import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import DomainRedirect from "@/components/DomainRedirect"

function App() {
  return (
    <>
      <DomainRedirect>
        <Pages />
      </DomainRedirect>
      <Toaster />
    </>
  )
}

export default App 