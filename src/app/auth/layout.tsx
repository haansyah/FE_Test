import type { Metadata } from "next";
import "../globals.css";
import Logo from "@/components/icon/logo";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to GIS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex flex-row">
          <div className="lg:w-1/2 min-h-screen flex flex-col items-center justify-center mx-auto relative pb-20">
            <div className="flex flex-col">
              <div className="px-4 mx-auto flex flex-col items-center">
                <div className="h-9 overflow-hidden">
                  <Logo className="h-full w-full" />
                </div>
                <div className="mt-3 text-lg font-semibold">
                  Welcome back to GIS
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Enter your username and password to continue
                </div>
              </div>
              <div>{children}</div>
            </div>
            <footer className="absolute bottom-2">
              <div className="text-xs text-muted-foreground text-center italic">
                Copyright &copy; 2025 Jasa Marga, All rights reserved
              </div>
            </footer>
          </div>
          <div className="hidden lg:block h-screen lg:w-1/2 p-1">
            <img
              src="/bg-1.jpg"
              alt="background"
              className="h-full w-full object-cover rounded-md"
            />
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
