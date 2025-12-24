"use client"

import { MovingBorderButton } from '@/components/ui/moving-border'

export function MovingBorderDemo() {
  return (
    <div className="p-6 flex items-center justify-center">
      <MovingBorderButton
        borderRadius="1.75rem"
        className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 font-semibold"
      >
        Borders are cool
      </MovingBorderButton>
    </div>
  )
}
