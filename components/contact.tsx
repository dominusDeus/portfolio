"use client";

import { AnimatedSection } from "@/components/animated-section";
import { SectionHeading } from "@/components/section-heading";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Github, Linkedin } from "lucide-react";
import { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageWasSent, setMessageWasSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    } satisfies ContactFormData;

    setIsSubmitting(true);
    // Add your form submission logic here
    try {
      const res = fetch("https://formspree.io/f/mldbddjg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
          subject: data.subject,
        }),
      });
      setMessageWasSent(true);
      setIsSubmitting(false);
    } catch (e) {
      console.log("MY CUSTOM ERROR: ", e instanceof Error ? e.message : e);
      setIsSubmitting(false);
    }
  };

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
                <h3 className="text-xl font-semibold mb-6 text-primary/90">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <motion.a
                    href="mailto:nataliacarrera.ads@gmail.com"
                    className="flex items-center group"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
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
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
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
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary/70">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="text-primary/90">Buenos Aires, Argentina</p>
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
                {messageWasSent ? (
                  <div className="text-primary h-[430px] flex flex-col justify-center items-center">
                    <p>Thank you for your interest 🩷</p>
                    <p></p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                        className="min-h-[120px] bg-primary/5 border-primary/10 focus:border-primary/20 placeholder:text-primary/30"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary/80 hover:bg-primary text-white"
                      disabled={isSubmitting}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Sending..." : "Send Message"}
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
