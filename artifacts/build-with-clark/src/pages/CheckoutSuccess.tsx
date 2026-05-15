import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </motion.div>

        <h1 className="text-4xl font-bold font-serif text-foreground mb-4">
          You're all set!
        </h1>
        <p className="text-xl text-muted-foreground mb-3">
          Payment confirmed — thank you for trusting me with your website.
        </p>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          I'll be in touch within one business day to kick things off and
          gather everything I need to build something you'll be proud of.
          Keep an eye on your inbox.
        </p>

        <div className="bg-muted rounded-2xl p-6 mb-8 text-left space-y-3">
          <h2 className="font-bold text-foreground">What happens next</h2>
          {[
            "I'll email you to introduce myself and get started",
            "We'll do a quick 15-minute call to go over your vision",
            "I'll send you a simple questionnaire to gather your details",
            "Then I get to work — you'll see a draft before anything goes live",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" className="font-bold" asChild>
            <a href="/#contact">
              <MessageCircle className="mr-2 h-4 w-4" />
              Send me a message now
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
