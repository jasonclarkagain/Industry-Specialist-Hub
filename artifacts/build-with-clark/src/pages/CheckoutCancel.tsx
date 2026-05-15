import { motion } from "framer-motion";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <HelpCircle className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-3xl font-bold font-serif text-foreground mb-3">
          No problem at all
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Your checkout was cancelled and nothing was charged. If you had
          questions or weren't sure which plan was right for you, I'm happy to
          help — just send me a message.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild className="font-bold">
            <a href="/#contact">Ask me a question</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/packages">
              <ArrowLeft className="mr-2 h-4 w-4" />
              View plans again
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
