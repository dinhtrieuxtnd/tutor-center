"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export const SuccessCircle = () => {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
            }}
            className="flex items-center justify-center w-[200px] h-[200px] md:w-[246px] md:h-[246px] rounded-full bg-green-500 relative"
        >
            {/* Icon check */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    delay: 0.3,
                    type: "spring",
                    stiffness: 200,
                    damping: 12,
                }}
                className="flex items-center justify-center"
            >
                <Check className="w-32 h-32 md:w-40 md:h-40 text-white" strokeWidth={3} />
            </motion.div>

            {/* Vòng tròn viền animate */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 0 }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: "loop",
                }}
                className="absolute w-[200px] h-[200px] md:w-[246px] md:h-[246px] rounded-full border-4 border-green-400"
            />
        </motion.div>
    );
};
