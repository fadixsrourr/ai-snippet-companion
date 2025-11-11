import { PropsWithChildren } from "react";
import { useSession } from "./useSession";
// import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { loading } = useSession();
  if (loading) return null;
  // To force auth later:
  // const { email } = useSession();
  // if (!email) return <Navigate to="/" replace />;
  return <>{children}</>;
}
