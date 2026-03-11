import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import CategoryIcon from './CategoryIcon';
import { createPortal } from 'react-dom';
import { useIsMobile } from '@/hooks';

interface Category {
    id: string;
    name: string;
    icon?: string;
    color?: string;
    type?: string;
}

interface CategorySelectProps {
    categories: Category[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ categories, value, onChange, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();
    const isMobile = useIsMobile();

    const selectedCategory = categories.find((c) => c.id === value);

    // Close simple popover on click outside (desktop)
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

    const handleSelect = (id: string) => {
        onChange(id);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-neutral-900 border rounded-xl shadow-sm transition-all text-left ${error
                    ? 'border-red-300 ring-4 ring-red-50 dark:border-red-900 dark:ring-red-900/20'
                    : 'border-gray-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20'
                    }`}
            >
                {selectedCategory ? (
                    <div className="flex items-center gap-3">
                        {selectedCategory.icon && (
                            <div
                                className="w-6 h-6 rounded-md flex items-center justify-center"
                                style={{ backgroundColor: `${selectedCategory.color}20`, color: selectedCategory.color }}
                            >
                                <CategoryIcon icon={selectedCategory.icon} color={selectedCategory.color} size="sm" />
                            </div>
                        )}
                        <span className="text-gray-900 dark:text-white font-medium">{selectedCategory.name}</span>
                    </div>
                ) : (
                    <span className="text-gray-500 dark:text-neutral-400">Selecione uma categoria</span>
                )}
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Popover Desktop & Mobile Bottom Sheet */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {isMobile ? (
                            createPortal(
                                <>
                                    {/* Mobile Overlay */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm"
                                        onClick={() => setIsOpen(false)}
                                    />

                                    {/* Bottom Sheet */}
                                    <motion.div
                                        initial={{ opacity: 0, y: "100%" }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: "100%" }}
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
                                        className="fixed z-[301] bottom-0 left-0 right-0 w-full bg-white dark:bg-neutral-800 rounded-t-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-neutral-700 flex flex-col max-h-[85vh]"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* Mobile handle */}
                                        <div
                                            className="w-full flex justify-center py-4 cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
                                            onPointerDown={(e) => {
                                                e.stopPropagation();
                                                dragControls.start(e);
                                            }}
                                        >
                                            <div className="w-12 h-1.5 bg-gray-300 dark:bg-neutral-600 rounded-full" />
                                        </div>

                                        <div className="px-5 pb-3">
                                            <p className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Categorias Disponíveis</p>
                                        </div>

                                        <div className="overflow-y-auto px-2 pb-10">
                                            {categories.length > 0 ? (
                                                <div className="space-y-1">
                                                    {categories.map((cat) => (
                                                        <button
                                                            key={cat.id}
                                                            type="button"
                                                            onClick={() => handleSelect(cat.id)}
                                                            className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-colors ${value === cat.id
                                                                ? 'bg-primary-50 dark:bg-primary-900/30'
                                                                : 'hover:bg-gray-50 dark:hover:bg-neutral-700/50'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                {cat.icon ? (
                                                                    <div
                                                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                                                        style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                                                                    >
                                                                        <CategoryIcon icon={cat.icon} color={cat.color} size="md" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-neutral-700 flex items-center justify-center">
                                                                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                                                                    </div>
                                                                )}
                                                                <span className={`text-base ${value === cat.id ? 'font-bold text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'}`}>
                                                                    {cat.name}
                                                                </span>
                                                            </div>
                                                            {value === cat.id && <Check className="w-5 h-5 text-primary-600 dark:text-primary-400" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center text-sm text-gray-500 dark:text-neutral-400">
                                                    Nenhuma categoria encontrada
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </>,
                                document.body
                            )
                        ) : (
                            /* Desktop Dropdown */
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-50 top-full mt-2 w-full min-w-[280px] bg-white dark:bg-neutral-800 rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-neutral-700 flex flex-col max-h-[300px]"
                            >
                                <div className="px-4 pb-2 pt-4">
                                    <p className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-2">Categorias Disponíveis</p>
                                </div>

                                <div className="overflow-y-auto px-2 pb-2">
                                    {categories.length > 0 ? (
                                        <div className="space-y-1">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => handleSelect(cat.id)}
                                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${value === cat.id
                                                        ? 'bg-primary-50 dark:bg-primary-900/30'
                                                        : 'hover:bg-gray-50 dark:hover:bg-neutral-700/50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {cat.icon ? (
                                                            <div
                                                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                                style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                                                            >
                                                                <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-neutral-700 flex items-center justify-center">
                                                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                                            </div>
                                                        )}
                                                        <span className={`text-sm ${value === cat.id ? 'font-semibold text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'}`}>
                                                            {cat.name}
                                                        </span>
                                                    </div>
                                                    {value === cat.id && <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-sm text-gray-500 dark:text-neutral-400">
                                            Nenhuma categoria encontrada
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategorySelect;
