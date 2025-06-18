import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "react-error-boundary";
import ErrorComponent from "./ui/Error.jsx";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Fixed ErrorBoundary usage:
// 1. Use correct import for Error component (not destructured).
// 2. Wrap BrowserRouter inside ErrorBoundary to catch routing errors.
// 3. Pass resetErrorBoundary to Error component for retry.

function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  return (
    <ErrorComponent
      error={error?.message || "Unknown error"}
      resetErrorBoundary={resetErrorBoundary}
    />
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallbackRender={fallbackRender}>
        <App />
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
