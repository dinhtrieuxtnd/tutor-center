"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ClickOutside } from "../common";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export const LinkDropdown = ({
  label,
  href,
}: {
  label: string;
  href: string;
}) => {
  return (
    <div className="hover:bg-[#E4E4E4] w-full rounded-lg px-3 py-2 inline-flex justify-start items-center gap-2.5">
      <Link
        href={href}
        className="whitespace-nowrap text-black text-xl font-semibold font-open-sans"
      >
        {label}
      </Link>
    </div>
  );
};

interface HomePageHeaderDropdownProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  ignoreSelectors?: string[];
  ignoreRefs?: React.RefObject<HTMLElement>[];
}

export const HomePageHeaderDropdown = ({
  children,
  isOpen,
  setIsOpen,
  ignoreSelectors = [],
  ignoreRefs = [],
}: HomePageHeaderDropdownProps) => {
  return (
    <ClickOutside 
      className="" 
      onClickOutside={() => setIsOpen(false)}
      ignoreSelectors={ignoreSelectors}
      ignoreRefs={ignoreRefs}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ 
              opacity: 0, 
              y: -8, 
              scale: 0.96,
              transformOrigin: "top center"
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transformOrigin: "top center"
            }}
            exit={{ 
              opacity: 0, 
              y: -8, 
              scale: 0.96,
              transformOrigin: "top center"
            }}
            transition={{ 
              duration: 0.15, 
              ease: [0.16, 1, 0.3, 1],
              scale: { duration: 0.12 }
            }}
            className="min-w-[220px] px-2 py-3 absolute mt-1 top-full rounded-xl left-0 w-full 
                 bg-white/95 backdrop-blur-md border border-gray-100
                 shadow-xl shadow-black/5 z-50 origin-top gap-1
                 max-h-60 overflow-y-auto
                 before:absolute before:-top-2 before:left-4 before:w-4 before:h-4 
                 before:bg-white/95 before:backdrop-blur-md before:border-l before:border-t 
                 before:border-gray-100 before:rotate-45 before:z-[-1]"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </ClickOutside>
  );
};
