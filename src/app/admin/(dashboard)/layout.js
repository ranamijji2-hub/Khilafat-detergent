import AdminShell from '@/components/admin/AdminShell';

export const metadata = { title: 'Admin Dashboard', robots: { index: false, follow: false } };

export default function AdminDashboardLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
