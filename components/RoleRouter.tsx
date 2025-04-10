import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function RoleRouter({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  const fullPath = segments.join("/");
  const role = userData?.role?.toLowerCase();
  const isLoggedIn = (!!user && typeof user !== "boolean") || user === false;

  useEffect(() => {
    if (loading) return;

    // ❌ Avoid redirect until userData is fully available
    if (!isLoggedIn || !userData || !role) return;

    // ✅ Only redirect if on login or root page
    if (fullPath.startsWith("login") || fullPath === "") {
      if (role === "parent") router.replace("/parent");
      else if (role === "member") router.replace("/member");
      else if (role === "staff") router.replace("/staff");
      else router.replace("/unknown-role");
    }
  }, [loading, isLoggedIn, userData, role, fullPath]);

  return <>{children}</>;
}
