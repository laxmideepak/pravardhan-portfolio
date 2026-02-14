import type { Metadata } from "next";
import Script from "next/script";
import { Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";

const headingFont = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Sora({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pravardhan Bheemavarapu | Senior Full Stack Developer",
  description:
    "Senior Full Stack Developer with 6+ years of experience in Java, Spring Boot, REST APIs, React, microservices, and cloud-native enterprise delivery.",
  openGraph: {
    title: "Pravardhan Bheemavarapu | Senior Full Stack Developer",
    description:
      "Senior Full Stack Developer with 6+ years of experience across banking, insurance, and IT service management domains.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${headingFont.variable} ${bodyFont.variable} antialiased`}>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              const saved = localStorage.getItem('portfolio-theme');
              const theme = saved === 'light' || saved === 'dark' ? saved : 'dark';
              document.documentElement.dataset.theme = theme;
            } catch (e) {}
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
