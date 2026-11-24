import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer, { BottomNav } from '@/components/Footer';
import { CartDrawer, Toast } from '@/components/CartParts';
import Motion from '@/components/Motion';

export const metadata: Metadata = {
  title: { default: 'Óticas Veluzzi — Elegância em cada olhar', template: '%s | Óticas Veluzzi' },
  description: 'Óculos de grau, óculos de sol, lentes e acessórios com atendimento especializado. Compre online com segurança.',
  openGraph: { title: 'Óticas Veluzzi', description: 'Elegância em cada olhar.', locale: 'pt_BR', type: 'website' },
};

export const viewport: Viewport = { themeColor: '#4E5146', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:font-bold">Pular para o conteúdo</a>
        <Header />
        <main id="conteudo" className="min-h-[60vh]">{children}</main>
        <Footer />
        <BottomNav />
        <CartDrawer />
        <Toast />
        <Motion />
      </body>
    </html>
  );
}
