"use client"

import type * as React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Star, Mail } from "lucide-react"
import type { SmartColumn, ColumnType } from "./smart-table"

type AddColumnDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddColumn: (column: SmartColumn) => void
  existingColumns: SmartColumn[]
}

export function AddColumnDialog({ open, onOpenChange, onAddColumn, existingColumns }: AddColumnDialogProps) {
  const [columnType, setColumnType] = useState<ColumnType>("text")
  const [columnName, setColumnName] = useState("")
  const [sourceColumn, setSourceColumn] = useState("")

  // Get text columns that can be used as source for smart columns
  const textColumns = existingColumns.filter(
    (col) => col.type === "text" || col.type === "website-content" || col.type === "reviews",
  )

  // Get URL columns that can be used as source for website content columns
  const urlColumns = existingColumns.filter((col) => col.type === "text" && col.header.toLowerCase().includes("url"))

  // Get business name columns that can be used as source for reviews
  const businessColumns = existingColumns.filter(
    (col) =>
      col.type === "text" &&
      (col.header.toLowerCase().includes("business") ||
        col.header.toLowerCase().includes("name") ||
        col.header.toLowerCase().includes("company")),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!columnName) return

    const newColumn: SmartColumn = {
      id: crypto.randomUUID(),
      type: columnType,
      header: columnName,
      accessorKey: columnName.toLowerCase().replace(/\s+/g, "_"),
      size: 180,
    }

    // Add source column for smart columns
    if (columnType === "website-content" || columnType === "reviews" || columnType === "ai-email") {
      newColumn.sourceColumn = sourceColumn
    }

    // Add metadata based on column type
    if (columnType === "website-content") {
      newColumn.meta = {
        status: "idle",
        lastFetched: null,
      }
    } else if (columnType === "reviews") {
      newColumn.meta = {
        minRating: 1,
        maxReviews: 5,
        status: "idle",
      }
    } else if (columnType === "ai-email") {
      newColumn.meta = {
        template: "Write a personalized email to {{name}} based on the information provided.",
        status: "idle",
      }
    }

    onAddColumn(newColumn)

    // Reset form
    setColumnName("")
    setColumnType("text")
    setSourceColumn("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new column</DialogTitle>
          <DialogDescription>
            Create a new column for your table. Smart columns can extract and generate data automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="column-name" className="text-right">
                Name
              </Label>
              <Input
                id="column-name"
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
                className="col-span-3"
                placeholder="Column name"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="column-type" className="text-right">
                Type
              </Label>
              <Select
                value={columnType}
                onValueChange={(value) => {
                  setColumnType(value as ColumnType)
                  setSourceColumn("")
                }}
              >
                <SelectTrigger id="column-type" className="col-span-3">
                  <SelectValue placeholder="Select column type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="website-content">
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4" />
                      <span>Website Content</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="reviews">
                    <div className="flex items-center">
                      <Star className="mr-2 h-4 w-4" />
                      <span>Reviews</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ai-email">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      <span>AI Email</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Source column selection for smart columns */}
            {columnType === "website-content" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source-column" className="text-right">
                  URL Source
                </Label>
                <Select value={sourceColumn} onValueChange={setSourceColumn} disabled={urlColumns.length === 0}>
                  <SelectTrigger id="source-column" className="col-span-3">
                    <SelectValue placeholder={urlColumns.length ? "Select URL column" : "No URL columns available"} />
                  </SelectTrigger>
                  <SelectContent>
                    {urlColumns.map((col) => (
                      <SelectItem key={col.id} value={col.accessorKey}>
                        {col.header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {columnType === "reviews" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source-column" className="text-right">
                  Business Source
                </Label>
                <Select value={sourceColumn} onValueChange={setSourceColumn} disabled={businessColumns.length === 0}>
                  <SelectTrigger id="source-column" className="col-span-3">
                    <SelectValue
                      placeholder={businessColumns.length ? "Select business column" : "No business columns available"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {businessColumns.map((col) => (
                      <SelectItem key={col.id} value={col.accessorKey}>
                        {col.header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {columnType === "ai-email" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source-column" className="text-right">
                  Data Source
                </Label>
                <Select value={sourceColumn} onValueChange={setSourceColumn} disabled={textColumns.length === 0}>
                  <SelectTrigger id="source-column" className="col-span-3">
                    <SelectValue
                      placeholder={textColumns.length ? "Select content column" : "No content columns available"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {textColumns.map((col) => (
                      <SelectItem key={col.id} value={col.accessorKey}>
                        {col.header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                !columnName ||
                (columnType === "website-content" && !sourceColumn) ||
                (columnType === "reviews" && !sourceColumn) ||
                (columnType === "ai-email" && !sourceColumn)
              }
            >
              Add column
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
