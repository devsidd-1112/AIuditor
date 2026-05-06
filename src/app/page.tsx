import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const tools = ["ChatGPT", "Claude", "Cursor", "Gemini", "Copilot"];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 sm:px-8 lg:px-10">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            AIuditor
          </span>
          <Button size="sm" variant="default">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 pt-14 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            AI Spend Audit Platform
          </div>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Stop Overpaying
            <br />
            for AI Tools
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Analyze your AI stack and uncover hidden savings across ChatGPT,
            Claude, Cursor, Gemini, and more.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button size="lg">
              Start Free Audit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              No credit card required
            </span>
          </div>
        </div>

        {/* Tool badges */}
        <div className="mt-20">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground/70">
            Supported tools
          </p>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <div
                key={tool}
                className="rounded-md border border-border/80 bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
