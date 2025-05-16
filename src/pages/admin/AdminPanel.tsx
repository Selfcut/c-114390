
import React from "react";
import { PageLayout } from "../../components/layouts/PageLayout";
import { TabNav } from "../../components/TabNav";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { AdminUserManagement } from "@/components/admin/AdminUserManagement";
import { AdminContentManagement } from "@/components/admin/AdminContentManagement";
import { AdminReports } from "@/components/admin/AdminReports";
import { AdminSpecialEffects } from "@/components/admin/AdminSpecialEffects";
import AdminSettings from "@/components/admin/AdminSettings";

const AdminPanel = () => {
  const adminTabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      content: <AdminDashboard />,
    },
    {
      id: "userManagement",
      label: "User Management",
      content: <AdminUserManagement />,
    },
    {
      id: "contentManagement",
      label: "Content Management",
      content: <AdminContentManagement />,
    },
    {
      id: "reports",
      label: "Reports",
      content: <AdminReports />,
    },
    {
      id: "specialEffects",
      label: "Special Effects",
      content: <AdminSpecialEffects />,
    },
    {
      id: "settings",
      label: "Settings",
      content: <AdminSettings />,
    },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
        <TabNav tabs={adminTabs} defaultTab="dashboard" />
      </div>
    </PageLayout>
  );
};

export default AdminPanel;
