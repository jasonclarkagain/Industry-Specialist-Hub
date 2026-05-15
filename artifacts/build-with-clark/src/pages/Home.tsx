import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Monitor, Phone, Wrench, ShieldCheck, Mail, ArrowRight, Zap, ShoppingCart, Bot, Smartphone, Database, Globe } from "lucide-react";

import { PreviewGenerator } from "@/components/PreviewGenerator";
import { HeroScene } from "@/components/HeroScene";
import { TechGlobe } from "@/components/TechGlobe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  projectType: z.string().min(1, "Please select a project type."),
  message: z.string().min(10, "Please tell me a little bit about what you need."),
});

type ContactValues = z.infer<typeof contactSchema>;

export function Home() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you within 24 hours.",
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "There was a problem sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold font-serif text-primary">Build With Clark</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How it works</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Why me?</a>
            <a href="#capabilities" className="text-sm font-medium hover:text-primary transition-colors">What I build</a>
            <a href="/packages" className="text-sm font-medium hover:text-primary transition-colors">Plans & Pricing</a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">About Jason</a>
          </nav>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <a href="#contact" data-testid="link-nav-contact">Get a Quote</a>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 py-16 md:py-24 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
          <HeroScene />
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-12 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_600px] items-center">
              <motion.div 
                initial="hidden" animate="visible" variants={staggerContainer}
                className="flex flex-col justify-center space-y-8"
              >
                <div className="space-y-4">
                  <motion.div variants={fadeIn} className="inline-flex items-center rounded-full border border-primary-foreground/30 px-3 py-1 text-sm font-medium bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm">
                    <span className="flex h-2 w-2 rounded-full bg-secondary mr-2 animate-pulse"></span>
                    Taking on new projects for {new Date().getFullYear()}
                  </motion.div>
                  <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl xl:text-7xl font-bold tracking-tighter leading-tight font-serif">
                    Professional websites for everyday people. <br className="hidden lg:block"/>
                    <span className="text-secondary">Priced fairly.</span>
                  </motion.h1>
                  <motion.p variants={fadeIn} className="max-w-[600px] text-lg md:text-xl text-primary-foreground/80 md:leading-relaxed">
                    Don't pay an agency thousands of dollars for a website. I'm Jason, an independent web designer who builds beautiful, hand-crafted sites that actually work—for a fraction of the cost.
                  </motion.p>
                </div>
                <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" variant="secondary" className="font-bold text-base h-12 px-8" asChild>
                    <a href="#contact" data-testid="button-hero-contact">Let's talk about your site <ArrowRight className="ml-2 h-5 w-5" /></a>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 h-12" asChild>
                    <a href="#pricing" data-testid="button-hero-pricing">See why I'm cheaper</a>
                  </Button>
                </motion.div>
                
                <motion.div variants={fadeIn} className="flex items-center gap-4 text-sm text-primary-foreground/70">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-primary-foreground/20 flex items-center justify-center text-xs font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                  <p>Trusted by dozens of small businesses</p>
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mx-auto flex w-full items-center justify-center lg:max-w-none"
              >
                <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-background/10 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img
                    alt="A clean, professional workspace"
                    className="object-cover w-full h-full"
                    src="/hero-workspace.png"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-medium text-lg leading-snug">"Jason made the whole process completely painless. I finally have a website I'm proud of."</p>
                    <p className="text-white/70 text-sm mt-2">— Sarah T., Local Bakery Owner</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* The Problem / Solution Section */}
        <section id="how-it-works" className="py-20 md:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary mb-6">You need a website, but your options are terrible.</h2>
              <p className="text-xl text-muted-foreground">I started this business because I was tired of seeing small businesses get ripped off by confusing options.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-muted rounded-2xl p-8 border border-border">
                <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-serif mb-3">Big Agencies</h3>
                <p className="text-muted-foreground">They charge $5,000+ for a basic site, talk in confusing tech jargon, and treat you like just another ticket number.</p>
              </div>
              
              <div className="bg-muted rounded-2xl p-8 border border-border">
                <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
                  <Monitor className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-serif mb-3">DIY Site Builders</h3>
                <p className="text-muted-foreground">Wix, Squarespace, and GoDaddy promise it's "easy," but you end up spending 40 hours building a site that looks like a template.</p>
              </div>
              
              <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-xl transform md:-translate-y-4 relative">
                <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  THE BETTER WAY
                </div>
                <div className="w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mb-6">
                  <Wrench className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-serif mb-3">Build With Clark</h3>
                <p className="text-primary-foreground/80 mb-6">A real person builds a custom, high-quality site for you. No jargon, no hidden fees, and a price that makes sense.</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-secondary" /> <span>Done for you</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-secondary" /> <span>Affordable pricing</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-secondary" /> <span>Talk to a real human</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Value Prop Section */}
        <section id="pricing" className="py-20 md:py-32 bg-muted relative">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary mb-6">How do I undercut everyone else on price?</h2>
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    It's simple: I don't have massive overhead. I don't rent a fancy office downtown, I don't have a team of salespeople, and I don't pay for expensive marketing campaigns.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    It's just me, my laptop, and years of experience building websites efficiently. I pass those savings directly to you.
                  </p>
                  
                  <div className="pt-6 grid sm:grid-cols-2 gap-4">
                    <div className="bg-background p-6 rounded-xl border border-border shadow-sm">
                      <div className="text-3xl font-bold text-primary mb-2">High Quality</div>
                      <p className="text-sm text-muted-foreground">Hand-coded or built on premium platforms, optimized for Google, and responsive on all phones.</p>
                    </div>
                    <div className="bg-background p-6 rounded-xl border border-border shadow-sm">
                      <div className="text-3xl font-bold text-primary mb-2">Low Price</div>
                      <p className="text-sm text-muted-foreground">Typically 40-60% less than what local agencies charge for the exact same quality of work.</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button asChild size="lg" className="font-bold">
                      <a href="/packages">See all plans &amp; pricing →</a>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-background rounded-2xl shadow-xl overflow-hidden border border-border">
                <div className="bg-primary p-6 text-primary-foreground text-center">
                  <h3 className="text-2xl font-bold font-serif">The "No-Nonsense" Process</h3>
                </div>
                <div className="p-8 space-y-8">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">We chat</h4>
                      <p className="text-muted-foreground">We jump on a quick call. You tell me about your business, I tell you what it will cost. No pressure.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">I build it</h4>
                      <p className="text-muted-foreground">You don't do any work. I design the site, write the words (if you need help), and set everything up.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">You review it</h4>
                      <p className="text-muted-foreground">You look at the site, tell me what you want changed, and I fix it until you're completely happy.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">We launch</h4>
                      <p className="text-muted-foreground">I put the site live on your domain. Your business looks great online.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 md:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl max-w-md mx-auto relative">
                  <img
                    alt="Jason Clark, smiling web designer"
                    className="object-cover w-full h-full"
                    src="/jason-portrait.png"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                    <p className="font-serif font-bold text-xl">Jason Clark</p>
                    <p className="text-white/80">Your neighborhood web guy</p>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary mb-6">Hi, I'm Jason.</h2>
                <div className="space-y-6 text-lg text-muted-foreground">
                  <p>
                    I don't wear a suit to work, and I don't use words like "synergy" or "paradigm shift." I'm just a guy who is really, really good at building websites.
                  </p>
                  <p>
                    I started Build With Clark because I saw friends starting small businesses getting overwhelmed by the tech side of things. They were either getting ripped off by sleazy marketing agencies or pulling their hair out trying to use DIY website builders.
                  </p>
                  <p>
                    When you hire me, you're not hiring a faceless company. You're hiring me. I answer the phone, I write the code, and I make sure you're happy with the result.
                  </p>
                  <p className="font-medium text-foreground">
                    I treat every project like it's for my own family. Let's build something great together.
                  </p>
                </div>
                
                <div className="mt-10 flex gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Call or Text</p>
                      <p className="font-bold text-primary">I reply fast</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="font-bold text-primary">Direct to my inbox</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What I Can Build Section */}
        <section id="capabilities" className="py-20 md:py-32 bg-muted overflow-hidden">
          <div className="container px-4 md:px-6">
            {/* Globe + heading side by side on desktop */}
            <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary mb-6">Whatever your business needs, I can build it.</h2>
                <p className="text-xl text-muted-foreground">Here's a plain-English look at the kinds of sites and tools I build. No tech talk — just what it means for you and your customers.</p>
              </motion.div>

              <motion.div
                className="relative h-72 lg:h-96"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
                aria-hidden="true"
              >
                <TechGlobe />
                {/* Orbiting tech-stack labels */}
                {[
                  { label: "React", top: "12%", left: "8%" },
                  { label: "Rust", top: "65%", left: "4%" },
                  { label: "Go", top: "22%", right: "6%" },
                  { label: "PostgreSQL", top: "72%", right: "2%" },
                  { label: "Next.js", top: "44%", left: "2%" },
                  { label: "AI / LLM", top: "48%", right: "4%" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="absolute font-mono text-xs font-bold text-primary/60 bg-background/80 border border-border rounded-full px-2.5 py-0.5 backdrop-blur-sm shadow-sm pointer-events-none"
                    style={{ top: item.top, left: item.left, right: item.right }}
                  >
                    {item.label}
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
            >
              {[
                {
                  icon: Globe,
                  title: "A site that looks great everywhere",
                  description: "Whether your customer is on their phone, tablet, or computer, your site will look sharp and be easy to use. No pinching and zooming, no cut-off text.",
                  techNote: "Responsive design · React · Modern CSS",
                  testId: "card-capability-responsive"
                },
                {
                  icon: Zap,
                  title: "Sites that load instantly",
                  description: "I can build sites that are genuinely fast — we're talking under a second to load. Slow sites lose customers. Google also ranks fast sites higher.",
                  techNote: "Go · Rust · Edge-optimized backends",
                  testId: "card-capability-fast"
                },
                {
                  icon: ShoppingCart,
                  title: "Online stores that take payments",
                  description: "Sell your products or services online. Customers can browse, add to cart, and pay — all without you having to do anything after setup.",
                  techNote: "E-commerce · Stripe · Inventory management",
                  testId: "card-capability-ecommerce"
                },
                {
                  icon: Bot,
                  title: "A chat assistant for your customers",
                  description: "Imagine having someone available 24/7 to answer questions from your website visitors — even while you're asleep. I can build that into your site.",
                  techNote: "AI integration · Chatbot · Real-time chat",
                  testId: "card-capability-ai"
                },
                {
                  icon: Database,
                  title: "Sites that remember your customers",
                  description: "Need people to make accounts, book appointments, or check their order history? I build sites with login systems, databases, and all the behind-the-scenes stuff that makes that work.",
                  techNote: "Full-stack · PostgreSQL · User accounts",
                  testId: "card-capability-fullstack"
                },
                {
                  icon: Smartphone,
                  title: "Apps for their phone",
                  description: "If you want something your customers can download from the App Store or Google Play, I can build that too. A real app, with your name and logo on it.",
                  techNote: "iOS · Android · React Native",
                  testId: "card-capability-mobile"
                },
              ].map((item) => (
                <motion.div
                  key={item.testId}
                  data-testid={item.testId}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  className="bg-background rounded-2xl p-8 border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 flex-shrink-0">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed flex-1">{item.description}</p>
                  <div className="mt-6 pt-5 border-t border-border">
                    <p className="text-xs text-muted-foreground/60 font-mono tracking-wide">{item.techNote}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-14"
            >
              <p className="text-lg text-muted-foreground mb-6">Don't see exactly what you need? Just ask. If it runs on the internet, I can probably build it.</p>
              <Button size="lg" asChild data-testid="button-capabilities-contact">
                <a href="#contact">Tell me what you need <ArrowRight className="ml-2 h-5 w-5" /></a>
              </Button>
            </motion.div>
          </div>
        </section>

        <PreviewGenerator />

        {/* CTA / Form Section */}
        <section id="contact" className="py-20 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto bg-background text-foreground rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
              <div className="p-8 md:p-12 md:w-5/12 bg-muted flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold font-serif text-primary mb-4">Let's get started.</h3>
                  <p className="text-muted-foreground mb-8">
                    Fill out this quick form. Tell me what you need. I'll get back to you with a fair price and a plan. No commitment, no hard sell.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span>Free consultation</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span>Transparent pricing</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span>Fast turnaround</span>
                  </div>
                </div>
              </div>
              
              <div className="p-8 md:p-12 md:w-7/12">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="col-span-2 sm:col-span-1">
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} data-testid="input-contact-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="col-span-2 sm:col-span-1">
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} data-testid="input-contact-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} data-testid="input-contact-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What do you need?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-contact-project">
                                <SelectValue placeholder="Select a project type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Brand new website">Brand new website</SelectItem>
                              <SelectItem value="Redesign existing site">Redesign existing site</SelectItem>
                              <SelectItem value="Add features to my site">Add features to my site</SelectItem>
                              <SelectItem value="Not sure yet">Not sure yet</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tell me about your business</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="I run a local plumbing business and need a simple site where people can see my services and contact me..." 
                              className="min-h-[120px]"
                              {...field} 
                              data-testid="input-contact-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" className="w-full text-base font-bold h-12" disabled={isSubmitting} data-testid="button-contact-submit">
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background py-12 border-t border-border">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Wrench className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold font-serif text-primary">Build With Clark</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Build With Clark. Handcrafted in Utah.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
