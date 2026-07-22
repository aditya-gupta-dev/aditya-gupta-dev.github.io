import { ThemeProvider } from "@/components/providers/theme-provider";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Outlet />
    </ThemeProvider>
  );
}
