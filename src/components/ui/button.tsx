
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-accent-primary)] text-white shadow hover:brightness-95 active:translate-y-px',
        destructive: 'bg-[var(--color-error)] text-white shadow hover:brightness-95 active:translate-y-px',
        outline: 'border border-[var(--border-default)] bg-white text-[var(--text-primary)] hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)]',
        secondary: 'bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)]',
        ghost: 'text-[var(--text-primary)] hover:bg-[var(--surface-hover)] hover:text-[var(--color-accent-primary)]',
        link: 'text-[var(--color-accent-primary)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2 rounded-[var(--radius-button)]',
        sm: 'h-9 px-3 rounded-[var(--radius-button)]',
        lg: 'h-11 px-8 rounded-[var(--radius-button)]',
        icon: 'h-10 w-10 rounded-[var(--radius-sm)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn('font-["Share_Tech",_sans-serif]', buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}/>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
