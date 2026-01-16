
import * as React from "react"
import { cn } from "@/lib/utils"

const Navigation = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn(
      "flex items-center space-x-4 lg:space-x-6",
      className
    )}
    {...props}/>
))
Navigation.displayName = "Navigation"

const NavigationItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { active?: boolean }
>(({ className, active, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "text-sm font-medium transition-colors hover:text-accent-primary",
      active && "text-accent-primary",
      className
    )}
    {...props}/>
))
NavigationItem.displayName = "NavigationItem"

export { Navigation, NavigationItem }
