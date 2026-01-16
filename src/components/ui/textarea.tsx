
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-[var(--border-default)] bg-[var(--surface-default)] px-3 py-2 text-sm font-['Share_Tech',_sans-serif] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] ring-offset-[var(--bg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}/>
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
