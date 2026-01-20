import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

/* =========================
   PROVIDER
========================= */
function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      {...props}
    />
  )
}

/* =========================
   ROOT
========================= */
function Tooltip(
  props: React.ComponentProps<typeof TooltipPrimitive.Root>
) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root {...props} />
    </TooltipProvider>
  )
}

/* =========================
   TRIGGER
========================= */
function TooltipTrigger(
  props: React.ComponentProps<typeof TooltipPrimitive.Trigger>
) {
  return <TooltipPrimitive.Trigger {...props} />
}

/* =========================
   CONTENT (WITH ARROW)
========================= */
interface TooltipContentProps
  extends React.ComponentProps<typeof TooltipPrimitive.Content> {
  withArrow?: boolean
}

function TooltipContent({
  className,
  sideOffset = 6,
  children,
  withArrow = true,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-fit rounded-md px-3 py-1.5 text-xs shadow-md",
          "bg-primary text-primary-foreground",
          "animate-in fade-in-0 zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=top]:slide-in-from-bottom-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          className
        )}
        {...props}
      >
        {children}

        {withArrow && (
          <TooltipPrimitive.Arrow
            className="fill-primary"
            width={10}
            height={5}
          />
        )}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
}
