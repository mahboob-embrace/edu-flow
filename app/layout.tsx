import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { ThemeProvider, ColorThemeProvider } from "@/components/theme";
import { SessionProvider } from "@/components/auth";

const fontSans = Figtree({subsets:['latin'],variable:'--font-sans'});


export const metadata: Metadata = {
  title: "Nova UI - shadcn/ui",
  description: "Next.js with shadcn/ui Nova style and multiple color schemes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} antialiased flex flex-col min-h-screen`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ColorThemeProvider>
              {children}
            </ColorThemeProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
