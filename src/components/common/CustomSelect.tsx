import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { haptics } from '@/utils/haptics';

export interface SelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface CustomSelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
    className?: string;
    dropdownTitle?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Selecione...',
    icon,
    className = '',
    dropdownTitle = 'Opções',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();

    const selectedOption = options.find((opt) => opt.value === value);

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

    const handleSelect = (val: string) => {
        haptics.light();
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => { haptics.light(); setIsOpen(!isOpen) }}
                className="w-full h-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-full shadow-sm transition-all hover:border-primary-300 dark:hover:border-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 text-left"
            >
                <div className="flex items-center gap-2 truncate">
                    {icon && <span className="flex-shrink-0">{icon}</span>}
                    {selectedOption?.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
                    <span className={`truncate font-medium ${selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-neutral-400'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Popover Desktop & Mobile Bottom Sheet */}
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
                            className="fixed sm:absolute z-50 bottom-0 left-0 right-0 sm:bottom-auto sm:left-0 sm:right-auto sm:top-full sm:mt-2 w-full sm:min-w-[240px] bg-white dark:bg-neutral-800 sm:rounded-xl rounded-t-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-neutral-700 flex flex-col max-h-[70vh] sm:max-h-[300px]"
                        >
                            {/* Mobile handle */}
                            <div
                                className="w-full flex justify-center py-4 -mt-2 mb-1 sm:hidden cursor-grab active:cursor-grabbing touch-none"
                                onPointerDown={(e) => dragControls.start(e)}
                            >
                                <div className="w-12 h-1.5 bg-gray-300 dark:bg-neutral-600 rounded-full" />
                            </div>

                            <div className="px-4 pb-2 pt-1 sm:pt-4">
                                <p className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-2">{dropdownTitle}</p>
                            </div>

                            <div className="overflow-y-auto px-2 pb-6 sm:pb-2">
                                {options.length > 0 ? (
                                    <div className="space-y-1">
                                        {options.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => handleSelect(opt.value)}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${value === opt.value
                                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                                                    : 'hover:bg-gray-50 dark:hover:bg-neutral-700/50 text-gray-700 dark:text-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 truncate">
                                                    {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
                                                    <span className={`truncate ${value === opt.value ? 'font-semibold' : ''}`}>
                                                        {opt.label}
                                                    </span>
                                                </div>
                                                {value === opt.value && <Check className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-sm text-gray-500 dark:text-neutral-400">
                                        Nenhuma opção
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomSelect;
