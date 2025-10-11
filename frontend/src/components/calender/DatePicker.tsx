"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
}

const formatDate = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
};

const parseDate = (str: string) => {
    const [dd, mm, yyyy] = str.split("/");
    if (!dd || !mm || !yyyy) return null;
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
};

const getDaysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();

export const DatePicker = ({ value, onChange }: DatePickerProps) => {
    const today = new Date();
    const initialDate = value ? parseDate(value) ?? today : today;

    const [month, setMonth] = useState(initialDate.getMonth());
    const [year, setYear] = useState(initialDate.getFullYear());
    const [view, setView] = useState<"day" | "month" | "year">("day");
    const [direction, setDirection] = useState<"left" | "right">("right");

    useEffect(() => {
        if (value) {
            const parsed = parseDate(value);
            if (parsed) {
                setMonth(parsed.getMonth());
                setYear(parsed.getFullYear());
            }
        }
    }, [value]);

    // --- Ngày ---
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = new Date(year, month, 1).getDay();
    const blanks = Array((firstDay + 6) % 7).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handleSelectDay = (day: number) => {
        const selected = new Date(year, month, day);
        const formatted = formatDate(selected);
        onChange(formatted);
    };

    // --- Tháng ---
    const months = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"];

    // --- Năm ---
    const startYear = Math.floor(year / 12) * 12;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    // Animation variants
    const variants = {
        enter: (dir: "left" | "right") => ({
            x: dir === "right" ? 100 : -100,
            opacity: 0,
        }),
        center: { x: 0, opacity: 1 },
        exit: (dir: "left" | "right") => ({
            x: dir === "right" ? -100 : 100,
            opacity: 0,
        }),
    };

    return (
        <div className="relative inline-block">
            <div className="absolute mt-2 w-80 bg-white border-2 border-primary rounded-xl shadow-lg p-4 z-10 overflow-hidden">
                {/* Nút hôm nay */}
                <div className="flex justify-start">
                    <button
                        type="button"
                        onClick={() => {
                            const formatted = formatDate(today);
                            setMonth(today.getMonth());
                            setYear(today.getFullYear());
                            setView("day");
                        }}
                        className="cursor-pointer px-2 py-1 text-sm font-bold bg-secondary text-primary rounded-lg hover:bg-secondary/80 transition font-open-sans"
                    >
                        Hôm nay
                    </button>
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mb-3 border-b border-primary pb-2">
                    <button
                        type="button"
                        onClick={() => {
                            setDirection("left");
                            if (view === "day") {
                                if (month === 0) {
                                    setMonth(11);
                                    setYear((y) => y - 1);
                                } else setMonth((m) => m - 1);
                            } else if (view === "year") {
                                setYear((y) => y - 12);
                            }
                        }}
                        className="cursor-pointer p-1 rounded-full hover:bg-secondary/30"
                    >
                        <ChevronLeft className="w-5 h-5 text-primary" />
                    </button>

                    <span
                        className="font-semibold cursor-pointer text-primary hover:text-secondary transition"
                        onClick={() => {
                            if (view === "day") setView("month");
                            else if (view === "month") setView("year");
                        }}
                    >
                        {view === "day" && `${month + 1}/${year}`}
                        {view === "month" && `${year}`}
                        {view === "year" && `${years[0]} - ${years[years.length - 1]}`}
                    </span>

                    <button
                        type="button"
                        onClick={() => {
                            setDirection("right");
                            if (view === "day") {
                                if (month === 11) {
                                    setMonth(0);
                                    setYear((y) => y + 1);
                                } else setMonth((m) => m + 1);
                            } else if (view === "year") {
                                setYear((y) => y + 12);
                            }
                        }}
                        className="cursor-pointer p-1 rounded-full hover:bg-secondary/30"
                    >
                        <ChevronRight className="w-5 h-5 text-primary" />
                    </button>
                </div>

                {/* Nội dung */}
                <div className="relative min-h-[290px]">
                    <AnimatePresence custom={direction} mode="popLayout">
                        <motion.div
                            key={`${view}-${month}-${year}`}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="absolute w-full"
                        >
                            {view === "day" && (
                                <>
                                    {/* Tên thứ */}
                                    <div className="grid grid-cols-7 text-center font-medium text-gray-600 mb-2">
                                        <div>T2</div><div>T3</div><div>T4</div>
                                        <div>T5</div><div>T6</div><div>T7</div><div>CN</div>
                                    </div>

                                    {/* Ngày */}
                                    <div className="grid grid-cols-7 text-center gap-y-1 mb-3">
                                        {blanks.map((_, i) => <div key={`b-${i}`} />)}
                                        {days.map((day) => {
                                            const formattedDay = formatDate(new Date(year, month, day));
                                            const isSelected = value === formattedDay;
                                            const isToday = formattedDay === formatDate(today);
                                            return (
                                                <button
                                                    type="button"
                                                    key={day}
                                                    onClick={() => handleSelectDay(day)}
                                                    className={`cursor-pointer w-10 h-10 flex items-center justify-center rounded-full 
                            ${isSelected ? "bg-primary text-white" :
                                                            isToday ? "border border-secondary text-primary" :
                                                                "hover:bg-secondary/30"}
                          `}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {view === "month" && (
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    {months.map((m, idx) => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => {
                                                setMonth(idx);
                                                setView("day");
                                            }}
                                            className="cursor-pointer py-2 rounded-lg transition hover:bg-secondary/30"
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {view === "year" && (
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    {years.map((y) => (
                                        <button
                                            key={y}
                                            type="button"
                                            onClick={() => {
                                                setYear(y);
                                                setView("month");
                                            }}
                                            className="cursor-pointer py-2 rounded-lg transition hover:bg-secondary/30"
                                        >
                                            {y}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>


            </div>
        </div>
    );
};
