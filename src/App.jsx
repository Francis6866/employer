import { RouterProvider } from "react-router-dom"
import "./App.css"
import { ThemeProvider } from "./components/ui/theme-provider"
import router from "./router/Router"


const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}/>
    </ThemeProvider>
    
  )
}

export default App