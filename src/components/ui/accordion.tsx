
"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple"
  collapsible?: boolean
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

const AccordionContext = React.createContext<{
  openItems: string[]
  toggleItem: (value: string) => void
} | null>(null)

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, type = "single", collapsible = true, defaultValue = [], value, onValueChange, children, ...props }, ref) => {
    const [openItems, setOpenItems] = React.useState<string[]>(
      Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
    )

    const controlledOpenItems = React.useMemo(
      () => value ? (Array.isArray(value) ? value : [value]) : openItems,
      [value, openItems]
    )

    const toggleItem = React.useCallback((itemValue: string) => {
      let newOpenItems: string[]

      if (type === "single") {
        if (controlledOpenItems.includes(itemValue)) {
          newOpenItems = collapsible ? [] : controlledOpenItems
        } else {
          newOpenItems = [itemValue]
        }
      } else {
        // multiple
        if (controlledOpenItems.includes(itemValue)) {
          newOpenItems = controlledOpenItems.filter(item => item !== itemValue)
        } else {
          newOpenItems = [...controlledOpenItems, itemValue]
        }
      }

      if (value === undefined) {
        setOpenItems(newOpenItems)
      }
      onValueChange?.(type === "single" ? newOpenItems[0] || "" : newOpenItems)
    }, [controlledOpenItems, type, collapsible, value, onValueChange])

    return (
      <AccordionContext.Provider value={{ openItems: controlledOpenItems, toggleItem }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = "Accordion"

const AccordionItemContext = React.createContext<string | null>(null)

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => (
  <AccordionItemContext.Provider value={value}>
    <div ref={ref} className={cn("border-b border-[var(--border-default)]", className)} {...props}>
      {children}
    </div>
  </AccordionItemContext.Provider>
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  const itemValue = React.useContext(AccordionItemContext)

  if (!context) {
    throw new Error("AccordionTrigger must be used within an Accordion")
  }

  if (!itemValue) {
    throw new Error("AccordionTrigger must be used within an AccordionItem")
  }

  const { openItems, toggleItem } = context
  const isOpen = openItems.includes(itemValue)

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex w-full flex-1 items-center justify-between py-4 font-medium font-['Share_Tech',_sans-serif] text-[var(--text-primary)] transition-all hover:text-[var(--color-accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]",
        className
      )}
      onClick={() => toggleItem(itemValue)}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          isOpen && "rotate-180"
        )}/>
    </button>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  const itemValue = React.useContext(AccordionItemContext)

  if (!context) {
    throw new Error("AccordionContent must be used within an Accordion")
  }

  if (!itemValue) {
    throw new Error("AccordionContent must be used within an AccordionItem")
  }

  const { openItems } = context
  const isOpen = openItems.includes(itemValue)

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden text-sm font-['Share_Tech',_sans-serif] text-[var(--text-primary)] transition-all duration-200",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0 text-[var(--text-secondary)]">{children}</div>
    </div>
  )
})
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
