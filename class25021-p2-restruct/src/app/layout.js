// src/app/layout.js - Server Component
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PharmaHub - Nhà thuốc trực tuyến',
  description: 'Mua thuốc chất lượng cao, giao hàng nhanh chóng',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
