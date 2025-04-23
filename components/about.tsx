"use client";

import { AnimatedSection } from "@/components/animated-section";
import { SectionHeading } from "@/components/section-heading";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export function About() {
  return (
    <AnimatedSection id="about">
      <div className="container">
        <SectionHeading
          title="About Me"
          subtitle="Learn more about my background and what drives me"
        />

        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-primary/90">
                Frontend Developer & UI/UX Enthusiast
              </h3>
              <p className="text-muted-foreground">
                I&apos;m a passionate frontend developer with a strong eye for
                design and user experience. My journey in web development
                started with a curiosity about how digital experiences are
                created, and it has evolved into a professional path where I
                combine technical skills with creative thinking.
              </p>
              <p className="text-muted-foreground">
                I&apos;m constantly learning and experimenting with new
                technologies to create responsive, accessible, and aesthetically
                pleasing web applications. My goal is to build digital solutions
                that not only meet technical requirements but also delight
                users.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <Card className="glass-card group hover:border-primary/20 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center">
                    <span className="text-3xl font-bold text-primary">3+</span>
                    <span className="text-sm text-primary/70">
                      Years Experience
                    </span>
                  </CardContent>
                </Card>
                <Card className="glass-card group hover:border-primary/20 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center">
                    <span className="text-3xl font-bold text-primary">10+</span>
                    <span className="text-sm text-primary/70">
                      Projects Completed
                    </span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}
