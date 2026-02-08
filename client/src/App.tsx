import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider, useNotification } from "./contexts/NotificationContext";
import { ToastContainer } from "./components/notifications/Toast";
import { AlertBannerContainer } from "./components/notifications/AlertBanner";
import { ModalContainer } from "./components/notifications/Modal";
import { NotificationCenter } from "./components/notifications/NotificationCenter";
import Home from "./pages/Home";
import ROICalculator from "./pages/ROICalculator";
import Products from "./pages/Products";
import Success from "./pages/Success";
import Account from "./pages/Account";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/calculator"} component={ROICalculator} />
      <Route path={"/products"} component={Products} />
      <Route path={"/success"} component={Success} />
      <Route path={"/account"} component={Account} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Notification system wrapper
function NotificationSystem() {
  const { toasts, banners, modals, inAppNotifications } = useNotification();

  return (
    <>
      <AlertBannerContainer banners={banners} />
      <ToastContainer notifications={toasts} />
      <ModalContainer modals={modals} />
      <div className="fixed top-4 right-4 z-40">
        <NotificationCenter notifications={inAppNotifications} />
      </div>
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <AuthProvider>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <NotificationSystem />
              <Router />
            </TooltipProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
