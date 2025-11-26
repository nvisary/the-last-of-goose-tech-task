import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "@pages/LoginPage";
import { RoundsListPage } from "@pages/RoundsListPage";
import { RoundDetailsPage } from "@pages/RoundDetailsPage";
import { ProtectedRoute } from "@shared/lib/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/rounds",
    element: (
      <ProtectedRoute>
        <RoundsListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/rounds/:id",
    element: (
      <ProtectedRoute>
        <RoundDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <LoginPage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
