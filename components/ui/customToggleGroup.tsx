"use client"

import React, { ReactElement } from "react"
import { cn } from "@/lib/utils"

interface CustomToggleGroupProps {
  value: string[]
  onValueChange: (values: string[]) => void
  children: ReactElement<CustomToggleItemProps> | ReactElement<CustomToggleItemProps>[]
  className?: string
}

export interface CustomToggleItemProps {
  value: string
  children: React.ReactNode
  className?: string
  // internal props injected by CustomToggleGroup
  selected?: boolean
  toggle?: () => void
}

/**
 * Custom toggle group that handles multiple selections.
 * Applies "active" styles for selected items.
 */
export function CustomToggleGroup({
  value,
  onValueChange,
  children,
  className,
}: CustomToggleGroupProps) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-2", className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<CustomToggleItemProps>(child)) return null

        const val = child.props.value

        return React.cloneElement<CustomToggleItemProps>(child, {
          selected: value.includes(val),
          toggle: () => {
            if (value.includes(val)) {
              onValueChange(value.filter((v) => v !== val))
            } else {
              onValueChange([...value, val])
            }
          },
        })
      })}
    </div>
  )
}

export function CustomToggleItem({
  children,
  selected = false,
  toggle,
  className,
}: CustomToggleItemProps) {
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "px-4 py-2 rounded-md border text-sm font-medium cursor-pointer transition",
        selected
          ? "bg-primary text-primary-foreground shadow"
          : "bg-background text-foreground hover:bg-muted",
        className
      )}
    >
      {children}
    </button>
  )
}
