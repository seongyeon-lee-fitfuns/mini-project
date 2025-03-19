import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'API 테스트 웹서비스',
  description: 'Nakama API Explorer and Management Console',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="icon"
          href="/favicon.ico"
          type="image/x-icon"
        />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
