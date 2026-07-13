import React from 'react'
import { motion } from 'framer-motion'

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white select-none">
      {/* Container de animação do logo */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Logo principal */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ 
            scale: [0.4, 1.15, 1], 
            opacity: 1 
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 280, 
            damping: 18,
            duration: 0.8
          }}
          className="w-24 h-24 flex items-center justify-center"
        >
          <img 
            src="/icons/logofincontrol.png" 
            alt="FinControl Logo" 
            className="w-full h-full object-contain pointer-events-none select-none"
          />
        </motion.div>

        {/* Nome do aplicativo abaixo com surgimento suave */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-primary-600 text-xl font-bold tracking-widest uppercase font-display mt-4 opacity-90"
        >
          FinControl
        </motion.h1>
      </div>

      {/* Indicador de carregamento discreto no rodapé */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="absolute bottom-12 flex items-center gap-1.5"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '300ms' }} />
      </motion.div>
    </div>
  )
}

export default SplashScreen
