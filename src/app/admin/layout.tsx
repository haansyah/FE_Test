import type { Metadata } from "next";
import "../globals.css";
import Link from "next/link";
import Logo from "@/components/icon/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Logout from "@/components/custom/Logout";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className=" min-h-screen flex flex-col">
          <header className="bg-white border-b border-muted">
            <div className="max-w-7xl px-4 py-4 mx-auto">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center">
                  <a href="/" className="h-5 overflow-hidden">
                    <Logo className="h-full w-full" />
                  </a>
                  <ul className="flex flex-row space-x-4 ml-10">
                    <li>
                      <Button variant="link">
                        <Link href="/admin/dashboard">Beranda</Link>
                      </Button>
                    </li>
                    <li>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="link">Master Data</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild>
                            <Link href="/admin/master-data/ruas">Ruas</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/admin/master-data/unit">Unit</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </li>
                  </ul>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="rounded-full" variant="outline">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                      {/* <DropdownMenuSeparator /> */}
                      {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
                      <DropdownMenuItem>
                        <Logout />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>
          <main>{children}</main>
          <footer className="bg-muted border-t border-muted mt-auto">
            <div className="max-w-7xl px-4 py-3 mx-auto text-sm text-muted-foreground">
              Copyright &copy; 2025 Jasa Marga, All rights reserved
            </div>
          </footer>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
