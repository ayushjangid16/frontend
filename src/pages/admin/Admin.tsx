import { AppSidebar } from "@/components/app-sidebar";
import { Outlet, useNavigate } from "react-router-dom";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { hasPermission } from "@/utils/permissions";

export default function Admin() {
  const userData = useSelector((state) => state.userReducer.userData);
  const navigate = useNavigate();
  useEffect(() => {
    const valid = hasPermission(
      "access_dashboard",
      userData.userInfo.permissions
    );

    if (!valid) {
      navigate("/home", { replace: true });
    }
  }, [userData]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="floating" />
      <SidebarInset>
        <SiteHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
