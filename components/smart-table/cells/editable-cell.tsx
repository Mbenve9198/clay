"use client"

import type * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type EditableCellProps = {
  value: any
  onUpdate: (value: any) => void
  type?: "text" | "number" | "date"
}

export function EditableCell({ value, onUpdate, type = "text" }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update local state when prop value changes
  useEffect(() => {
    setEditValue(value)
  }, [value])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    onUpdate(editValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false)
      onUpdate(editValue)
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setEditValue(value) // Reset to original value
    }
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-8 w-full"
      />
    )
  }

  return (
    <div
      className={cn(
        "h-8 px-2 flex items-center cursor-pointer rounded hover:bg-muted/50",
        !value && "text-muted-foreground italic",
      )}
      onDoubleClick={handleDoubleClick}
    >
      {value || "Double-click to edit"}
    </div>
  )
}
