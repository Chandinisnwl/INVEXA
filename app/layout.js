import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'INVEXA — Where Ambition Meets Investment',
  description:
    'The premier venture capital SaaS platform connecting high-growth startups with verified angel investors and venture funds.',
  keywords: ['venture capital', 'startup funding', 'investor platform', 'pitch deck', 'angel investors'],
  openGraph: {
    title: 'INVEXA — Where Ambition Meets Investment',
    description: 'Connect high-growth startups with verified angel investors and venture funds.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full scroll-smooth ${inter.variable}`}>
      <body className="min-h-full flex flex-col bg-surface text-darkSlate antialiased selection:bg-accent/20 selection:text-accent font-sans">
        {children}
      </body>
    </html>
  );
}
