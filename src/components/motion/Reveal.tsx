"use client";

import { motion, useInView, type HTMLMotionProps } from "framer-motion";
import React, { useRef } from "react";

/**
 * Animates children in on mount with a subtle fade + lift.
 * Use for hero sections, page intros, and above-the-fold content.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  duration = 0.5,
  className,
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggers child reveals. Pair with `RevealItem` for list elements.
 */
export function RevealStagger({
  children,
  stagger = 0.06,
  className,
}: {
  children: React.ReactNode;
  stagger?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Only animates when scrolled into view. Use for sections below the fold.
 */
export function ScrollReveal({
  children,
  y = 24,
  duration = 0.5,
  className,
}: {
  children: React.ReactNode;
  y?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
