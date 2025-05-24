import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { constructMetadata } from "@/utils/metadata";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const instrument = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata = constructMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${instrument.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
