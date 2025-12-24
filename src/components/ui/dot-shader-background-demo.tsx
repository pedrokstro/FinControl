"use client"

import { DotScreenShader } from '@/components/ui/dot-shader-background'

export default function DotShaderDemo() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white flex flex-col gap-6 items-center justify-center overflow-hidden">
      <DotScreenShader className="absolute inset-0 opacity-80" />
      <div className="relative z-10 text-center space-y-4 px-6">
        <p className="text-sm uppercase tracking-[0.6em] text-white/70">FinControl</p>
        <h1 className="text-5xl md:text-6xl font-light tracking-tight">
          DIGITAL INNOVATION
        </h1>
        <p className="text-white/80 max-w-3xl mx-auto leading-relaxed">
          Where thoughts take shape and consciousness flows like liquid mercury through infinite dimensions.
        </p>
      </div>
    </div>
  )
}
