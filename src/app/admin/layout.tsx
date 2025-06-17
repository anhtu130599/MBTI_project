import AdminLayout from '@/features/admin/components/AdminLayout';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
} 