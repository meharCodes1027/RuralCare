"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

// Motion variants for reusable animations
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 }
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 }
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3 }
  },
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: {},
    transition: { duration: 0 }
  }
};

type AnimationVariant = keyof typeof animations;

// Animated div component with preset animations
export const MotionDiv = ({ 
  variant = "fadeIn", 
  children, 
  className = "", 
  delay = 0,
  ...props 
}: { 
  variant?: AnimationVariant;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  [key: string]: any;
}) => {
  const selectedAnimation = animations[variant];
  
  return (
    <motion.div
      initial={selectedAnimation.initial}
      animate={selectedAnimation.animate}
      exit={selectedAnimation.exit}
      transition={{ ...selectedAnimation.transition, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animated card component based on card styles
export const MotionCard = ({ 
  variant = "scale", 
  children, 
  className = "", 
  delay = 0,
  ...props 
}: { 
  variant?: AnimationVariant;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  [key: string]: any;
}) => {
  const selectedAnimation = animations[variant];
  
  return (
    <motion.div
      initial={selectedAnimation.initial}
      animate={selectedAnimation.animate}
      exit={selectedAnimation.exit}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      transition={{ ...selectedAnimation.transition, delay }}
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Staggered list animation
export const MotionList = ({ 
  children, 
  className = "", 
  staggerDelay = 0.05,
  ...props 
}: { 
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  [key: string]: any;
}) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay
          }
        },
        exit: {}
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animated list item
export const MotionListItem = ({ 
  children, 
  className = "",
  ...props 
}: { 
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
      }}
      transition={{ duration: 0.3 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animated button
export const MotionButton = ({ 
  children, 
  className = "",
  ...props 
}: { 
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Animated text
export const MotionText = ({ 
  children, 
  className = "",
  delay = 0,
  ...props 
}: { 
  children: React.ReactNode;
  className?: string;
  delay?: number;
  [key: string]: any;
}) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.span>
  );
};

// Animated presence wrapper
export const MotionPresence = AnimatePresence; 