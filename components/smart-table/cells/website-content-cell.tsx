"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Globe, Loader2, RefreshCw } from "lucide-react"
import type { SmartColumn } from "../smart-table"
import type { Row } from "@tanstack/react-table"

type WebsiteContentCellProps = {
  row: Row<any>
  column: SmartColumn
  onUpdate: (value: string) => void
  sourceUrl: string
}

// Mock function to simulate website content extraction
async function extractWebsiteContent(url: string): Promise<string> {
  // In a real implementation, this would call the Apify API
  console.log(`Extracting content from ${url}`)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Return mock content
  return `This is extracted content from ${url}. In a real implementation, this would be the actual text content from the website, extracted using Apify's Website Content Extractor. The content would include main text from the page, removing navigation, footers, and other non-essential elements.`
}

export function WebsiteContentCell({ row, column, onUpdate, sourceUrl }: WebsiteContentCellProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const value = row.getValue(column.id) as string

  const handleExtract = async () => {
    if (!sourceUrl) {
      setError("No URL provided in the source column")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const content = await extractWebsiteContent(sourceUrl)
      onUpdate(content)
    } catch (err) {
      setError("Failed to extract content")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={value ? "default" : "outline"} className="h-6 px-2">
              <Globe className="h-3 w-3 mr-1" />
              {value ? "Extracted" : "Not extracted"}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {value ? "Website content has been extracted" : "Click to extract content from the website URL"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 px-2" disabled={isLoading || !sourceUrl}>
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : value ? (
              <span className="text-xs">View</span>
            ) : (
              <span className="text-xs">Extract</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Website Content</h4>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                onClick={handleExtract}
                disabled={isLoading || !sourceUrl}
              >
                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              </Button>
            </div>

            {error && <div className="text-sm text-destructive">{error}</div>}

            {!sourceUrl && <div className="text-sm text-muted-foreground">No URL provided in the source column</div>}

            {sourceUrl && (
              <div className="text-sm text-muted-foreground mb-2">
                Source: <span className="font-mono text-xs">{sourceUrl}</span>
              </div>
            )}

            <div className="max-h-40 overflow-y-auto rounded border p-2 text-sm">
              {value || "No content extracted yet"}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
