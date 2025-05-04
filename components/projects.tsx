"use client";

import { AnimatedSection } from "@/components/animated-section";
import { SectionHeading } from "@/components/section-heading";
import { AnimatePresence, motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import Image from "next/image";

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  links: {
    demo?: string;
    repo?: string;
  };
}

const projectsData: Project[] = [
  {
    title: "Fitness Tracker",
    description:
      "A fitness tracking app that allows users to track workouts, set goals, and monitor progress.",
    image:
      "https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    tags: ["React Native", "TypeScript", "GraphQL", "MongoDB"],
    links: {
      demo: "fitness.nataliacarrera.com",
      repo: "https://github.com/dominusDeus/bod-e-bloom-tracker",
    },
  },
  {
    title: "Escuela Amor Propio",
    description:
      "An institute for personal development, mindfulness and self care.",
    image: "/images/escuela-amor-propio.png",
    tags: ["React", "Tailwind CSS", "Next.js"],
    links: {
      demo: "https://escuelaamorpropio.reml.live/",
      // repo: "https://github.com/example/project",
    },
  },
  {
    title: "Social Media App",
    description:
      "A responsive social media application with post sharing, user profiles, and real-time messaging.",
    image:
      "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    tags: ["React", "Firebase", "Redux", "Styled Components"],
    links: {
      demo: "https://example.com",
      repo: "https://github.com/example/project",
    },
  },
];

export function Projects() {
  return (
    <AnimatedSection
      id="projects"
      className="bg-primary/[0.02] dark:bg-primary/[0.02]"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-center mb-12 ">
          <SectionHeading
            title="Projects"
            subtitle="A showcase of my work and personal projects"
            className="md:mb-0 md:items-center md:text-center"
          />
        </div>

        <AnimatePresence>
          {projectsData.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="mb-8">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No projects available yet. Check back soon to see my work!
                </AlertDescription>
              </Alert>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projectsData.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden group">
                    <div className="relative overflow-hidden h-48">
                      <Image
                        height={200}
                        width={500}
                        src={project.image}
                        alt={project.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <CardHeader className="flex-none">
                      <CardTitle>{project.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardDescription className="text-muted-foreground">
                        {project.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="flex-none flex gap-3">
                      {project.links.demo && (
                        <Button size="sm" asChild>
                          <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" /> Site
                          </a>
                        </Button>
                      )}
                      {project.links.repo && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={project.links.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="mr-2 h-4 w-4" /> Code
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedSection>
  );
}
