import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
    isSameDay,
    parseISO,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CustomDatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (value: string) => void;
    error?: string;
    minDate?: string; // Optional limits
    maxDate?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, error, minDate, maxDate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();

    // Parse current value or use today (handle timezone securely parsing as ISO just the date)
    const selectedDate = value ? (value.includes('T') ? parseISO(value.split('T')[0]) : parseISO(value)) : new Date();

    const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));

    useEffect(() => {
        // Keep internal calendar month in sync with the value if it changes from outside
        setCurrentMonth(startOfMonth(selectedDate));
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

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const handleDateClick = (day: Date) => {
        onChange(format(day, 'yyyy-MM-dd'));
        setIsOpen(false);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4 px-2">
                <button
                    type="button"
                    onClick={prevMonth}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-neutral-400"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                <button
                    type="button"
                    onClick={nextMonth}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-neutral-400"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 }); // 0 = Domingo

        for (let i = 0; i < 7; i++) {
            const day = addDays(startDate, i)
            days.push(
                <div key={i} className="text-center text-xs font-semibold text-gray-400 dark:text-neutral-500 py-2">
                    {format(day, 'EEEEE', { locale: ptBR }).toUpperCase()}
                </div>
            );
        }
        return <div className="grid grid-cols-7 mb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

        const min = minDate ? parseISO(minDate) : null;
        const max = maxDate ? parseISO(maxDate) : null;

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day;

                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());

                // Check disabled conditions
                const isBeforeMin = min ? day < startOfDayBoundary(min) : false;
                const isAfterMax = max ? day > endOfDayBoundary(max) : false;
                const isDisabled = isBeforeMin || isAfterMax;

                days.push(
                    <div
                        key={day.toString()}
                        className="p-0.5"
                    >
                        <button
                            type="button"
                            disabled={isDisabled}
                            onClick={() => handleDateClick(cloneDay)}
                            className={`w-full aspect-square flex items-center justify-center rounded-full text-sm sm:text-base transition-all
                    ${isDisabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
                    ${!isCurrentMonth && !isDisabled ? 'text-gray-300 dark:text-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-800' : ''}
                    ${isCurrentMonth && !isDisabled && !isSelected && !isToday ? 'text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800' : ''}
                    ${isSelected ? 'bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-600 font-bold shadow-md shadow-primary-500/20' : ''}
                    ${isToday && !isSelected ? 'border-2 border-primary-500 text-primary-600 dark:text-primary-400 font-bold' : ''}
                `}
                        >
                            {formattedDate}
                        </button>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div>{rows}</div>;
    };

    const startOfDayBoundary = (d: Date) => {
        const copy = new Date(d);
        copy.setHours(0, 0, 0, 0);
        return copy;
    }
    const endOfDayBoundary = (d: Date) => {
        const copy = new Date(d);
        copy.setHours(23, 59, 59, 999);
        return copy;
    }

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-neutral-900 border rounded-xl shadow-sm transition-all focus:outline-none focus:ring-4 text-left ${isOpen ? 'border-primary-500 ring-primary-100 dark:ring-primary-900/20' : ''
                    } ${error
                        ? 'border-red-300 ring-red-50 dark:border-red-900 dark:ring-red-900/20'
                        : 'border-gray-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 focus:ring-primary-100 dark:focus:ring-primary-900/20'
                    }`}
            >
                <span className="text-gray-900 dark:text-white font-medium capitalize truncate">
                    {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </span>
                <CalendarIcon className={`w-5 h-5 flex-shrink-0 transition-colors ${isOpen ? 'text-primary-500' : 'text-gray-400'}`} />
            </button>

            {/* Popover */}
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
                            className="fixed sm:absolute z-50 bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-0 sm:top-full sm:mt-2 w-full sm:min-w-[340px] bg-white dark:bg-neutral-900 sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-neutral-800 flex flex-col p-4 sm:p-5 pb-8 sm:pb-5"
                        >
                            {/* Mobile handle */}
                            <div
                                className="w-full flex justify-center pb-4 -mt-2 sm:hidden cursor-grab active:cursor-grabbing touch-none"
                                onPointerDown={(e) => dragControls.start(e)}
                            >
                                <div className="w-12 h-1.5 bg-gray-300 dark:bg-neutral-600 rounded-full" />
                            </div>

                            {renderHeader()}
                            {renderDays()}
                            {renderCells()}

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={() => handleDateClick(new Date())}
                                    className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                                >
                                    Ir para Hoje
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200 px-4 py-2 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-lg transition-colors sm:hidden"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomDatePicker;
