import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  RefreshCw,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type PreviewResult = {
  headline: string;
  subheadline: string;
  description: string;
  services: { title: string; description: string }[];
  callToAction: string;
  accentColor: string;
};

export function PreviewGenerator() {
  const { toast } = useToast();
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState<PreviewResult | null>(null);

  async function handleGenerate() {
    if (!businessName.trim() || !businessType.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/preview-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: businessName.trim(),
          businessType: businessType.trim(),
        }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setResult(data);
    } catch {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "Could not generate a preview. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!result) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/generate-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result, businessName: businessName.trim() }),
      });
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const slug = businessName.toLowerCase().replace(/[^a-z0-9]/g, "");
      a.href = url;
      a.download = `${slug}-landing-page.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast({
        title: "Page downloaded!",
        description:
          "Open the HTML file in any browser — it's a standalone page ready to share.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setDownloading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setBusinessName("");
    setBusinessType("");
  }

  return (
    <section
      id="demo"
      className="py-20 md:py-32 bg-background relative overflow-hidden"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4" />
            Try it yourself — live demo
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary mb-5">
            See what your website could look like — in seconds.
          </h2>
          <p className="text-xl text-muted-foreground">
            Type in your business name and what you do. I'll show you a real
            example of what a professional site for your business could look
            like.
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-muted rounded-3xl p-8 border border-border shadow-sm"
              >
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Your business name
                    </label>
                    <Input
                      data-testid="input-demo-business-name"
                      placeholder="e.g. Mike's Plumbing, Sunrise Bakery, Clean Cut Landscaping..."
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="h-12 text-base"
                      onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      What do you do?
                    </label>
                    <Input
                      data-testid="input-demo-business-type"
                      placeholder="e.g. plumber, family bakery, dog groomer, hair salon..."
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="h-12 text-base"
                      onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    />
                  </div>
                </div>
                <Button
                  data-testid="button-demo-generate"
                  size="lg"
                  className="w-full h-12 text-base font-bold"
                  onClick={handleGenerate}
                  disabled={
                    loading || !businessName.trim() || !businessType.trim()
                  }
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Building your preview...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Show me what my site could look like
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Free — no signup, no credit card. Just a taste of what's
                  possible.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-5"
              >
                {/* Mini site preview card */}
                <div
                  className="rounded-3xl overflow-hidden border-2 shadow-xl"
                  style={{ borderColor: result.accentColor + "40" }}
                  data-testid="div-preview-result"
                >
                  {/* Fake browser chrome */}
                  <div className="bg-muted px-4 py-2.5 flex items-center gap-2 border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 bg-background rounded-md px-3 py-1 text-xs text-muted-foreground font-mono text-center">
                      www.
                      {businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}
                      .com
                    </div>
                    {/* Download button inside browser chrome */}
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-background"
                      title="Download as HTML page"
                    >
                      {downloading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Download className="h-3.5 w-3.5" />
                      )}
                      <span className="hidden sm:inline">Save page</span>
                    </button>
                  </div>

                  {/* Hero */}
                  <div
                    className="p-8 md:p-12 text-white"
                    style={{ backgroundColor: result.accentColor }}
                  >
                    <div className="max-w-lg">
                      <p className="text-sm font-semibold mb-3 opacity-80 uppercase tracking-widest">
                        {businessName}
                      </p>
                      <h3 className="text-2xl md:text-4xl font-bold font-serif leading-tight mb-4">
                        {result.headline}
                      </h3>
                      <p className="text-base md:text-lg opacity-90 mb-6">
                        {result.subheadline}
                      </p>
                      <div
                        className="inline-block bg-white text-sm font-bold px-6 py-2.5 rounded-lg"
                        style={{ color: result.accentColor }}
                      >
                        {result.callToAction}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-background px-8 py-6 border-b border-border">
                    <p className="text-muted-foreground text-base leading-relaxed">
                      {result.description}
                    </p>
                  </div>

                  {/* Services */}
                  <div className="bg-background px-8 py-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                      What we offer
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      {result.services.map((service, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-border p-4"
                        >
                          <div
                            className="w-2 h-2 rounded-full mb-3"
                            style={{ backgroundColor: result.accentColor }}
                          />
                          <p className="font-bold text-sm text-foreground mb-1">
                            {service.title}
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Download CTA banner */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex items-center justify-between gap-4 bg-muted border border-border rounded-2xl px-6 py-4"
                >
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      Download this page
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Get a real standalone HTML file — open it in any browser,
                      share it, or send it to Clark to build the real thing.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="shrink-0 font-semibold"
                    data-testid="button-download-page"
                  >
                    {downloading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    {downloading ? "Saving…" : "Save as .html"}
                  </Button>
                </motion.div>

                {/* The pitch */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="bg-primary text-primary-foreground rounded-3xl p-8 text-center shadow-xl"
                  data-testid="div-preview-pitch"
                >
                  <p className="text-2xl md:text-3xl font-bold font-serif mb-3">
                    Like what you see?
                  </p>
                  <p className="text-primary-foreground/80 text-lg mb-2">
                    That took me about 10 seconds. Imagine what I can do when I
                    actually sit down and build your real site — with your logo,
                    your photos, your words, and everything working the way it
                    should.
                  </p>
                  <p className="text-secondary font-bold text-xl mb-6">
                    For less than you'd pay for a logo at most agencies.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="font-bold h-12 px-8"
                      asChild
                      data-testid="button-preview-contact"
                    >
                      <a href="#contact">
                        Let's build the real thing{" "}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </a>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
                      onClick={handleReset}
                      data-testid="button-preview-reset"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try a different business
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
