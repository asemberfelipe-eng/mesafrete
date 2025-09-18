export const metadata = { title: 'MesaFrete' };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
        {children}
      </body>
    </html>
  );
}
