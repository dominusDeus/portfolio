"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-muted-foreground">
              &copy; {currentYear} Natalia Carrera. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center">
              Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> by Nat
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
