import { ThemeProvider } from "@/components/providers/theme-provider";
import { Outlet } from "react-router-dom";
import { usePageTracking } from "@/lib/useAnalytics";
import { AuthProvider } from "@/components/providers/auth-provider";

export default function App() {
  usePageTracking();

  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </ThemeProvider>
  );
}
