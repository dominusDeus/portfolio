"use client";

import { AnimatedSection } from "@/components/animated-section";
import { SectionHeading } from "@/components/section-heading";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Github, Linkedin } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { saveContactSubmission } from "@/lib/firestore";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data: ContactFormData = {
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        subject: String(formData.get("subject") || ""),
        message: String(formData.get("message") || ""),
      };
      await saveContactSubmission(data);
      setSucceeded(true);
      formRef.current?.reset();
    } catch (err) {
      console.error("Failed to save contact submission", err);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setSucceeded(false);
  }

  return (
    <AnimatedSection id="contact" className="bg-primary/[0.02]">
      <div className="container">
        <SectionHeading
          title="Contact Me"
          subtitle="Let's connect and discuss your next project"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-card h-full">
              <CardContent className="p-6">
                {succeeded ? (
                  <div className="text-primary h-[430px] flex flex-col justify-center items-center relative">
                    <p>Thank you for your interest 🩷</p>
                    <button
                      onClick={() => reset()}
                      className={cn(
                        "pt-2 underline text-xs text-muted-secondary hover:text-chart-3/3 hover:scale-110 font-bold transition-all "
                      )}
                    >
                      Back to form
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-6 text-primary/90">
                      Contact Information
                    </h3>

                    <div className="space-y-6">
                      <motion.a
                        href="mailto:nataliacarrera.ads@gmail.com"
                        className="flex items-center group"
                        whileHover={{ x: 4 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary/70 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="text-primary/90 group-hover:text-primary transition-colors">
                            nataliacarrera.ads@gmail.com
                          </p>
                        </div>
                      </motion.a>

                      <motion.div
                        className="flex items-center"
                        whileHover={{ x: 4 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary/70">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="text-primary/90">+54 (911) 66714437</p>
                        </div>
                      </motion.div>

                      <motion.div
                        className="flex items-center"
                        whileHover={{ x: 4 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary/70">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-muted-foreground">
                            Location
                          </p>
                          <p className="text-primary/90">
                            Buenos Aires, Argentina
                          </p>
                        </div>
                      </motion.div>
                    </div>
                    <div className="mt-8">
                      <h4 className="font-medium mb-4 text-primary">
                        Connect with me
                      </h4>
                      <div className="flex space-x-4">
                        <a
                          href="https://github.com/dominusDeus"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-muted h-10 w-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors"
                        >
                          <Github className="h-5 w-5 text-primary" />
                          <span className="sr-only">GitHub</span>
                        </a>
                        <a
                          href="https://www.linkedin.com/in/natalia-l-carrera"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-muted h-10 w-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors"
                        >
                          <Linkedin className="h-5 w-5 text-primary" />
                          <span className="sr-only">LinkedIn</span>
                        </a>
                        <a
                          href="mailto:nataliacarrera.ads@gmail.com"
                          className="bg-muted h-10 w-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors"
                        >
                          <Mail className="h-5 w-5 text-primary" />
                          <span className="sr-only">Email</span>
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                {succeeded ? (
                  <div className="text-primary h-[430px] flex flex-col justify-center items-center relative">
                    <p>Thank you for your interest 🩷</p>
                    <button
                      onClick={() => reset()}
                      className={cn(
                        "pt-2 underline text-xs text-muted-secondary hover:text-chart-3/3 hover:scale-110 font-bold transition-all "
                      )}
                    >
                      Back to form
                    </button>
                  </div>
                ) : (
                  <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm text-primary/70"
                        >
                          Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          required
                          className="bg-primary/5 border-primary/10 focus:border-primary/20 placeholder:text-primary/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm text-primary/70"
                        >
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Your email"
                          required
                          className="bg-primary/5 border-primary/10 focus:border-primary/20 placeholder:text-primary/30"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="text-sm text-primary/70"
                      >
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Message subject"
                        required
                        className="bg-primary/5 border-primary/10 focus:border-primary/20 placeholder:text-primary/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm text-primary/70"
                      >
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message"
                        required
                        className="min-h-[120px] bg-primary/5 border-primary/10 focus:border-primary/20 placeholder:text-primary/30"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary/80 hover:bg-primary text-white"
                      disabled={submitting}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}
