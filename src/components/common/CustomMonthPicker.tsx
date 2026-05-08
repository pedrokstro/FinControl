import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
    format,
    addYears,
    subYears,
    startOfYear,
    eachMonthOfInterval,
    endOfYear,
    isSameMonth,
    parseISO,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { haptics } from '@/utils/haptics';

interface CustomMonthPickerProps {
    value: string; // YYYY-MM
    onChange: (value: string) => void;
    label?: string;
}

const CustomMonthPicker: React.FC<CustomMonthPickerProps> = ({ value, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();

    const selectedDate = value ? parseISO(`${value}-01`) : new Date();
    const [currentYear, setCurrentYear] = useState(startOfYear(selectedDate));

    useEffect(() => {
        setCurrentYear(startOfYear(selectedDate));
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen]);

    const nextYear = () => { haptics.light(); setCurrentYear(addYears(currentYear, 1)) };
    const prevYear = () => { haptics.light(); setCurrentYear(subYears(currentYear, 1)) };

    const handleMonthClick = (month: Date) => {
        haptics.light();
        onChange(format(month, 'yyyy-MM'));
        setIsOpen(false);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4 px-2">
                <button
                    type="button"
                    onClick={prevYear}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-neutral-400"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                    {format(currentYear, 'yyyy')}
                </h2>
                <button
                    type="button"
                    onClick={nextYear}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-neutral-400"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        );
    };

    const renderMonths = () => {
        const months = eachMonthOfInterval({
            start: startOfYear(currentYear),
            end: endOfYear(currentYear)
        });

        return (
            <div className="grid grid-cols-3 gap-2">
                {months.map((month) => {
                    const isSelected = isSameMonth(month, selectedDate);
                    const isCurrentMonth = isSameMonth(month, new Date());

                    return (
                        <button
                            key={month.toString()}
                            type="button"
                            onClick={() => handleMonthClick(month)}
                            className={`py-3 px-2 rounded-xl text-sm font-medium transition-all
                                ${isSelected 
                                    ? 'bg-primary-600 text-white font-bold shadow-md shadow-primary-500/20' 
                                    : 'text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800'
                                }
                                ${isCurrentMonth && !isSelected ? 'border border-primary-500 text-primary-600 dark:text-primary-400' : ''}
                            `}
                        >
                            {format(month, 'MMM', { locale: ptBR }).replace('.', '')}
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            {label && (
                <label className="block text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-2 ml-1">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => { haptics.light(); setIsOpen(!isOpen) }}
                className={`w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-neutral-900 border rounded-xl shadow-sm transition-all focus:outline-none focus:ring-4 text-left ${isOpen ? 'border-primary-500 ring-primary-100 dark:ring-primary-900/20' : 'border-gray-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
            >
                <span className="text-gray-900 dark:text-white font-medium capitalize truncate">
                    {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
                </span>
                <CalendarIcon className={`w-5 h-5 flex-shrink-0 transition-colors ${isOpen ? 'text-primary-500' : 'text-gray-400'}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Mobile Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown / Bottom Sheet */}
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            drag="y"
                            dragControls={dragControls}
                            dragListener={false}
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={{ top: 0, bottom: 0.4 }}
                            onDragEnd={(_, { offset, velocity }) => {
                                if (offset.y > 100 || velocity.y > 400) {
                                    setIsOpen(false);
                                }
                            }}
                            className="fixed sm:absolute z-50 bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-0 sm:top-full sm:mt-2 w-full sm:min-w-[300px] bg-white dark:bg-neutral-900 sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-neutral-800 flex flex-col p-4 sm:p-5 pb-8 sm:pb-5"
                        >
                            {/* Mobile handle */}
                            <div
                                className="w-full flex justify-center pb-4 -mt-2 sm:hidden cursor-grab active:cursor-grabbing touch-none"
                                onPointerDown={(e) => {
                                    e.stopPropagation();
                                    dragControls.start(e);
                                }}
                            >
                                <div className="w-12 h-1.5 bg-gray-300 dark:bg-neutral-600 rounded-full" />
                            </div>

                            {renderHeader()}
                            {renderMonths()}

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 flex justify-end sm:hidden">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200 px-4 py-2 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                                >
                                    Fechar
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomMonthPicker;
