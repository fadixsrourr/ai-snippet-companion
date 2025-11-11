import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "../pages/Home";
import SnippetsPage from "../features/snippets/components/SnippetsPage";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import Login from "../pages/Login"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> }, 
      {
        path: "/snippets",
        element: (
          <ProtectedRoute>
            <SnippetsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
