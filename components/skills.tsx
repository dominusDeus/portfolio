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
];

const softSkills: Skill[] = [
  { name: "Communication", level: 90 },
  { name: "Problem Solving", level: 85 },
  { name: "Teamwork", level: 95 },
  { name: "Time Management", level: 80 },
  { name: "Adaptability", level: 85 },
  { name: "Creativity", level: 90 },
];

function SkillProgress({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-6"
    >
      <div className="flex justify-between mb-2">
        <span className="font-medium">{skill.name}</span>
        <span className="text-muted-foreground">{skill.level}%</span>
      </div>
      <Progress value={skill.level} className="h-2" />
    </motion.div>
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
        
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="technical" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="technical">Technical Skills</TabsTrigger>
              <TabsTrigger value="soft">Soft Skills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="technical">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {technicalSkills.slice(0, Math.ceil(technicalSkills.length / 2)).map((skill, index) => (
                        <SkillProgress key={skill.name} skill={skill} index={index} />
                      ))}
                    </div>
                    <div>
                      {technicalSkills.slice(Math.ceil(technicalSkills.length / 2)).map((skill, index) => (
                        <SkillProgress key={skill.name} skill={skill} index={index + Math.ceil(technicalSkills.length / 2)} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="soft">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {softSkills.slice(0, Math.ceil(softSkills.length / 2)).map((skill, index) => (
                        <SkillProgress key={skill.name} skill={skill} index={index} />
                      ))}
                    </div>
                    <div>
                      {softSkills.slice(Math.ceil(softSkills.length / 2)).map((skill, index) => (
                        <SkillProgress key={skill.name} skill={skill} index={index + Math.ceil(softSkills.length / 2)} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AnimatedSection>
  );
}