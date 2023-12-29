import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Error from "./components/layout/Error";
import Home from "./pages/home/Home";
import Attendances from "./pages/attendances/Attendances";
import { AnimatePresence } from "framer-motion";
import { ScrollToTop } from "./utils/ScrollToTop";
import AppContextProvider from "./context/AppContext";

function App() {
  const router = createBrowserRouter([
    {
      element: (
        <AppContextProvider>
          <AnimatePresence>
            <Outlet />
            <ScrollToTop />
          </AnimatePresence>
        </AppContextProvider>
      ),
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/attendances",
          element: <Attendances />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
