import AdminLayout from '@/components/admin-layout';
import { Toaster } from 'sonner';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <AdminLayout>{children}</AdminLayout>
    </>
  )
} 