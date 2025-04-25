"use client";

import { AnimatedSection } from "@/components/animated-section";
import { SectionHeading } from "@/components/section-heading";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BriefcaseIcon, GraduationCapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const experienceData = [
  {
    title: "Product Oriented Software Developer",
    company: "Halo Media LLC",
    period: "Nov 2024 - Present",
    description:
      "Developing widgets and full-stack solutions for clients in the ticket sales industry, including FIBA World Cup. Delivering intuitive user interfaces and efficient backend systems.",
    skills: [
      "React",
      "Typescript",
      "Redux",
      "Next.js",
      "Tailwind CSS",
      "MongoDB",
      "Postgres",
      "NestJS",
    ],
    type: "work",
  },
  {
    title: "Full Stack Web Developer",
    company: "Halo Media LLC",
    period: "Feb 2022 - Oct 2024",
    description:
      "Implemented over 10 widgets for clients like Spartan, KingTut, and Pumpkin Nights. Developed intuitive UIs and integrated backend services for seamless ticket management.",
    skills: [
      "Vite",
      "Material UI",
      "Sass",
      "Jira",
      "GitHub",
      "Bitbucket",
      "Scrum",
      "Kanban",
    ],
    type: "work",
  },
  {
    title: "DevOps Engineer",
    company: "EY",
    period: "Jan 2020 - Feb 2022",
    description:
      "Worked on DevOps practices and systems integration for software deployment and process automation.",
    skills: ["DevOps", "CI/CD", "Automation"],
    type: "work",
  },
  {
    title: "Mentor",
    company: "Acámica",
    period: "Mar 2020 - Oct 2020",
    description:
      "Mentored aspiring developers in Full Stack Web Development, providing support and feedback on projects and concepts.",
    skills: ["Mentoring", "Web Development", "Teaching"],
    type: "work",
  },
  {
    title: "Full Stack Web Development",
    company: "Acámica",
    period: "2019 - 2020",
    description:
      "Completed intensive training in full stack development, mastering modern web technologies.",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    type: "education",
  },
  {
    title: "Special Education Teacher",
    company: "ISPEE",
    period: "2004 - 2008",
    description:
      "Studied special education and pedagogy, developing a strong foundation in educational theory and practice.",
    skills: ["Education", "Special Needs", "Teaching Methods"],
    type: "education",
  },
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
                  className={`absolute top-1 left-0 ${
                    index % 2 === 0 ? "md:-right-4 md:left-auto" : "md:-left-4"
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
                    <div className="text-sm text-muted-foreground">
                      {item.company}
                    </div>
                    <div className="text-sm font-medium text-primary">
                      {item.period}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline">
                          {skill}
                        </Badge>
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
