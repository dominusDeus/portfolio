"use client";

import { AnimatedSection } from "@/components/animated-section";
import { SectionHeading } from "@/components/section-heading";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Skill {
  name: string;
  level: number;
}

const technicalSkills: Skill[] = [
  { name: "HTML/CSS", level: 90 },
  { name: "JavaScript", level: 85 },
  { name: "React", level: 80 },
  { name: "Next.js", level: 75 },
  { name: "TypeScript", level: 70 },
  { name: "Tailwind CSS", level: 85 },
  { name: "Git", level: 80 },
  { name: "UI/UX Design", level: 75 },

  // Additional from resume:
  { name: "Redux", level: 70 },
  { name: "Jotai", level: 60 },
  { name: "Vite", level: 65 },
  { name: "Sass", level: 70 },
  { name: "Material UI", level: 75 },
  { name: "MongoDB", level: 70 },
  { name: "PostgreSQL", level: 65 },
  { name: "NestJS", level: 60 },
  { name: "Bitbucket", level: 70 },
  { name: "GitHub", level: 80 }, // You already had Git, this is more specific
  { name: "Azure", level: 65 },
  { name: "Jira", level: 75 },
  { name: "Scrum", level: 80 },
  { name: "Kanban", level: 70 },
];

const softSkills: Skill[] = [
  { name: "Communication", level: 90 },
  { name: "Problem Solving", level: 85 },
  { name: "Teamwork", level: 95 },
  { name: "Time Management", level: 80 },
  { name: "Adaptability", level: 85 },
  { name: "Creativity", level: 90 },
  { name: "Leadership", level: 85 },
  { name: "Mentoring", level: 80 },
  { name: "Multilingual Communication", level: 90 },
  { name: "Organizational Skills", level: 88 },
  { name: "Client Communication", level: 87 },
  { name: "Project Management", level: 82 },
  { name: "Attention to Detail", level: 80 },
];

function SkillProgress({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="mb-4"
    >
      <div className="flex justify-between mb-1.5">
        <span className="text-sm font-medium">{skill.name}</span>
        <span className="text-sm text-muted-foreground">{skill.level}%</span>
      </div>
      <Progress value={skill.level} className="h-2" />
    </motion.div>
  );
}

function SkillGrid({ skills }: { skills: Skill[] }) {
  const midPoint = Math.ceil(skills.length / 2);
  const leftColumnSkills = skills.slice(0, midPoint);
  const rightColumnSkills = skills.slice(midPoint);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        {leftColumnSkills.map((skill, index) => (
          <SkillProgress key={skill.name} skill={skill} index={index} />
        ))}
      </div>
      <div className="space-y-6">
        {rightColumnSkills.map((skill, index) => (
          <SkillProgress
            key={skill.name}
            skill={skill}
            index={index + midPoint}
          />
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <AnimatedSection id="skills">
      <div className="container px-4 md:px-6">
        <SectionHeading
          title="Skills"
          subtitle="Technical and soft skills I've developed over the years"
        />

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="technical" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="technical">Technical Skills</TabsTrigger>
              <TabsTrigger value="soft">Soft Skills</TabsTrigger>
            </TabsList>

            <TabsContent value="technical">
              <Card>
                <CardContent className="p-6">
                  <SkillGrid skills={technicalSkills} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="soft">
              <Card>
                <CardContent className="p-6">
                  <SkillGrid skills={softSkills} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AnimatedSection>
  );
}
