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
import { cn } from "@/lib/utils";
import FallingText from "@/components/ui/falling-text";
import TextType from "@/components/ui/text-type";
import FadeContent from "@/components/ui/fade-text";

function IDUPage() {
  const [state, handleSubmit, reset] = useForm("manodbpd");
  const [isVisible, setIsVisible] = useState(true);

  if (state.succeeded) {
    return (
      <div className="reltive text-3xl font-bold text-black h-screen flex justify-center items-center w-screen pb-20 ">
        <TextType
          onEnded={() => {
            console.log("onEnded");
            setIsVisible(false);
          }}
          className={cn(isVisible ? "opacity-100" : "opacity-0")}
          textColors={["#000"]}
          text={[
            "Gracias por tu interés 🩷",
            "Si querés saber más sobre mí, te dejo mi página web",
          ]}
          typingSpeed={75}
          pauseDuration={1000}
          showCursor={true}
          cursorCharacter="|"
          loop={false}
        />
        {!isVisible && (
          <FadeContent
            blur={true}
            duration={1000}
            easing="ease-out"
            initialOpacity={0}
            className="relative left-0 top-0"
          >
            {"https://www.nataliacarrera.com"}
          </FadeContent>
        )}
      </div>
    );
  }

  return (
    <AnimatedSection id="contact" className="bg-primary/[0.02]">
      <div className="container">
        <SectionHeading
          title="Formulario de Inscripción "
          subtitle="Recibe actualizaciones sobre las nuevas habilitaciones de IDUs"
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
                  Información de Contacto
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
                      <p className="text-sm text-muted-foreground">Teléfono</p>
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
                      <p className="text-sm text-muted-foreground">Ubicación</p>
                      <p className="text-primary/90">Buenos Aires, Argentina</p>
                    </div>
                  </motion.div>
                </div>
                <div className="mt-8">
                  <h4 className="font-medium mb-4 text-primary">Contactame</h4>
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
                {state.succeeded ? (
                  <div className="text-primary h-[430px] flex flex-col justify-center items-center relative">
                    <p>
                      Gracias por tu interés y sigámos ayudándonos entre
                      nosotros 🩷
                    </p>
                    {/* <button
                      onClick={() => reset()}
                      className={cn(
                        "pt-2 underline text-xs text-muted-secondary hover:text-chart-3/3 hover:scale-110 font-bold transition-all "
                      )}
                    >
                      Back to form
                    </button> */}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm text-primary/70"
                        >
                          Nombre
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Tu nombre"
                          required
                          className="bg-primary/5 border-primary/10 focus:border-primary/20 placeholder:text-primary/30"
                        />
                        <ValidationError
                          prefix="name"
                          field="name"
                          errors={state.errors}
                          className="text-red-500 text-sm"
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
                          placeholder="Tu email"
                          required
                          className="bg-primary/5 border-primary/10 focus:border-primary/20 placeholder:text-primary/30"
                        />
                        <ValidationError
                          prefix="Email"
                          field="email"
                          errors={state.errors}
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="text-sm text-primary/70"
                      >
                        Mails diarios o solo si hay actualizaciones
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Tu preferencia"
                        required
                        className="bg-primary/5 border-primary/10 focus:border-primary/20 placeholder:text-primary/30"
                      />
                      <ValidationError
                        prefix="Subject"
                        field="subject"
                        errors={state.errors}
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm text-primary/70"
                      >
                        Comentarios adicionales
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tu comentario"
                        required
                        className="min-h-[120px] bg-primary/5 border-primary/10 focus:border-primary/20 placeholder:text-primary/30"
                      />
                      <ValidationError
                        prefix="Message"
                        field="message"
                        errors={state.errors}
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary/80 hover:bg-primary text-white"
                      disabled={state.submitting}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {state.submitting ? "Enviando..." : "Suscribite"}
                    </Button>
                    <ValidationError
                      errors={state.errors}
                      className="text-red-500 text-sm"
                    />
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

export default IDUPage;
