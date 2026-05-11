import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 sm:px-8 lg:px-10">
        <Link href="/" className="text-sm font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity">
          AIuditor
        </Link>
        <Button size="sm" variant="default" asChild>
          <Link href="/audit">Start Audit</Link>
        </Button>
      </div>
    </nav>
  );
}
