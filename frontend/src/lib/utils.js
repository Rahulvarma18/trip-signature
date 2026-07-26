import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Standard shadcn-style class-merging helper.
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}