import { ThemeProvider } from "@/components/providers/theme-provider";
import { Outlet } from "react-router-dom";
import { usePageTracking } from "@/lib/useAnalytics";

export default function App() {
  usePageTracking();

  return (
    <ThemeProvider defaultTheme="system">
      <Outlet />
    </ThemeProvider>
  );
}
