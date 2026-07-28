import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdmin } from "@/stores/useAdmin";
import type { ReactNode } from "react";

export default function AdminRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, loading } = useAdmin();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
}