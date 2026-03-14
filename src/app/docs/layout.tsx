"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Coins, HelpCircle, Code, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/docs", label: "Getting Started", icon: BookOpen },
  { href: "/docs/credits", label: "Credits", icon: Coins },
  { href: "/docs/faq", label: "FAQ", icon: HelpCircle },
  { href: "/docs/api", label: "API Reference", icon: Code },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation navigation" className="flex flex-col gap-1">
      {sidebarLinks.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/docs" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            {...(onNavigate ? { onClick: onNavigate } : {})}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <link.icon className="h-4 w-4 shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-24">
            <h2 className="font-semibold text-sm mb-3 px-3">Documentation</h2>
            <SidebarNav />
          </div>
        </aside>

        {/* Mobile sidebar trigger */}
        <div className="md:hidden fixed bottom-4 right-4 z-40">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" aria-label="Open documentation navigation">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>Documentation</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <SidebarNav onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
