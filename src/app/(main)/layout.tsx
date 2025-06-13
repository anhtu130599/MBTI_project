import { Header } from '@/shared/components/organisms/Header';
import { Footer } from '@/shared/components/organisms/Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
} 