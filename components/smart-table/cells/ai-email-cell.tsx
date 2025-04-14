"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Mail, Loader2, RefreshCw, Copy, Check } from "lucide-react"
import type { SmartColumn } from "../smart-table"
import type { Row } from "@tanstack/react-table"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AIEmailCellProps = {
  row: Row<any>
  column: SmartColumn
  onUpdate: (value: string) => void
  data: Record<string, any>
}

// Mock function to simulate AI email generation
async function generateEmail(template: string, data: Record<string, any>, language = "english"): Promise<string> {
  // In a real implementation, this would call the Claude API
  console.log(`Generating email with template: ${template}`)
  console.log(`Data:`, data)
  console.log(`Language: ${language}`)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simple template variable replacement
  let email = template

  // Replace variables in the format {{variable}}
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "string" || typeof value === "number") {
      email = email.replace(new RegExp(`{{${key}}}`, "g"), String(value))
    }
  })

  // Add some AI-generated content based on the language
  const greeting =
    language === "english"
      ? "Dear"
      : language === "italian"
        ? "Gentile"
        : language === "spanish"
          ? "Estimado/a"
          : "Dear"

  const closing =
    language === "english"
      ? "Best regards,"
      : language === "italian"
        ? "Cordiali saluti,"
        : language === "spanish"
          ? "Saludos cordiales,"
          : "Best regards,"

  // Generate a mock email
  return `${greeting} ${data.name || "Customer"},

${email}

${closing}
Your Company Name`
}

export function AIEmailCell({ row, column, onUpdate, data }: AIEmailCellProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [template, setTemplate] = useState(
    column.meta?.template || "Write a personalized email to {{name}} based on the information provided.",
  )
  const [language, setLanguage] = useState("english")
  const [copied, setCopied] = useState(false)
  const value = row.getValue(column.id) as string

  const handleGenerate = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const email = await generateEmail(template, data, language)
      onUpdate(email)
    } catch (err) {
      setError("Failed to generate email")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={value ? "default" : "outline"} className="h-6 px-2">
              <Mail className="h-3 w-3 mr-1" />
              {value ? "Generated" : "Not generated"}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {value ? "AI-generated email is ready" : "Click to generate an email using AI"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 px-2" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : value ? (
              <span className="text-xs">View</span>
            ) : (
              <span className="text-xs">Generate</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">AI Email Generator</h4>
              <div className="flex space-x-2">
                {value && (
                  <Button variant="outline" size="icon" className="h-6 w-6" onClick={handleCopy}>
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                )}
                <Button variant="outline" size="icon" className="h-6 w-6" onClick={handleGenerate} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            {error && <div className="text-sm text-destructive">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="template">Email Template</Label>
              <Textarea
                id="template"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                placeholder="Write your email template here. Use {{variable}} to insert data."
                className="h-24 resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Available variables:{" "}
                {Object.keys(data)
                  .map((key) => `{{${key}}}`)
                  .join(", ")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {value && (
              <div className="space-y-2">
                <Label>Generated Email</Label>
                <div className="max-h-60 overflow-y-auto rounded border p-3 text-sm whitespace-pre-line">{value}</div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
