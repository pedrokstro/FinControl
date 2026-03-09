import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryIcon from './CategoryIcon';

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
                            className="fixed sm:absolute z-50 bottom-0 left-0 right-0 sm:bottom-auto sm:left-0 sm:right-auto sm:top-full sm:mt-2 w-full sm:min-w-[280px] bg-white dark:bg-neutral-800 sm:rounded-xl rounded-t-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-neutral-700 flex flex-col max-h-[70vh] sm:max-h-[300px]"
                        >
                            {/* Mobile handle */}
                            <div className="w-full flex justify-center py-3 sm:hidden cursor-pointer" onClick={() => setIsOpen(false)}>
                                <div className="w-12 h-1.5 bg-gray-300 dark:bg-neutral-600 rounded-full" />
                            </div>

                            <div className="px-4 pb-2 pt-1 sm:pt-4">
                                <p className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-2">Categorias Disponíveis</p>
                            </div>

                            <div className="overflow-y-auto px-2 pb-6 sm:pb-2">
                                {categories.length > 0 ? (
                                    <div className="space-y-1">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => handleSelect(cat.id)}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${value === cat.id
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
                                                    <span className={`${value === cat.id ? 'font-semibold text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'}`}>
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
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategorySelect;
