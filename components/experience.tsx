"use client";

import { AnimatedSection } from "@/components/animated-section";
import { SectionHeading } from "@/components/section-heading";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BriefcaseIcon, GraduationCapIcon } from "lucide-react";

const experienceData = [
  {
    title: "Frontend Developer",
    company: "Tech Solutions Inc.",
    period: "2023 - Present",
    description: "Developed responsive web applications using React, Next.js, and Tailwind CSS. Collaborated with UI/UX designers to implement pixel-perfect interfaces.",
    skills: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    type: "work"
  },
  {
    title: "UI/UX Designer",
    company: "Creative Agency",
    period: "2022 - 2023",
    description: "Created user interfaces and experiences for web and mobile applications. Conducted user research and usability testing.",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    type: "work"
  },
  {
    title: "Web Development Intern",
    company: "StartUp Co.",
    period: "2021 - 2022",
    description: "Assisted in the development of web applications. Learned modern frontend technologies and best practices.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    type: "work"
  },
  {
    title: "Bachelor's in Computer Science",
    company: "University of Technology",
    period: "2018 - 2022",
    description: "Studied computer science with a focus on web development and user interface design.",
    skills: ["Web Development", "Algorithm Design", "Database Management"],
    type: "education"
  }
];

export function Experience() {
  return (
    <AnimatedSection id="experience" className="bg-muted/30">
      <div className="container px-4 md:px-6">
        <SectionHeading 
          title="Experience & Education" 
          subtitle="My professional journey and educational background"
        />
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border -ml-0.5 md:ml-0" />
          
          <div className="space-y-12">
            {experienceData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${
                  index % 2 === 0 
                    ? "md:pr-12 md:text-right md:ml-auto md:mr-1/2" 
                    : "md:pl-12 md:text-left md:mr-auto md:ml-1/2"
                } pl-12 md:pl-0 md:w-1/2`}
              >
                <div 
                  className={`absolute top-1 left-0 md:left-auto ${
                    index % 2 === 0 ? "md:-right-4" : "md:-left-4"
                  } h-8 w-8 rounded-full bg-primary/10 border border-primary flex items-center justify-center`}
                >
                  {item.type === "work" ? (
                    <BriefcaseIcon className="h-4 w-4 text-primary" />
                  ) : (
                    <GraduationCapIcon className="h-4 w-4 text-primary" />
                  )}
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <div className="text-sm text-muted-foreground">{item.company}</div>
                    <div className="text-sm font-medium text-primary">{item.period}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}