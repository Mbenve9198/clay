"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Star, Loader2, RefreshCw } from "lucide-react"
import type { SmartColumn } from "../smart-table"
import type { Row } from "@tanstack/react-table"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

type Review = {
  rating: number
  text: string
  author: string
  date: string
}

type ReviewsData = {
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

type ReviewsCellProps = {
  row: Row<any>
  column: SmartColumn
  onUpdate: (value: ReviewsData) => void
  businessName: string
}

// Mock function to simulate reviews fetching
async function fetchBusinessReviews(businessName: string, minRating = 1, maxReviews = 5): Promise<ReviewsData> {
  // In a real implementation, this would call the Apify API
  console.log(`Fetching reviews for ${businessName}`)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Generate mock reviews
  const mockReviews: Review[] = Array.from({ length: maxReviews }).map((_, i) => {
    const rating = Math.max(minRating, Math.floor(Math.random() * 5) + 1)
    return {
      rating,
      text: `This is a ${rating}-star review for ${businessName}. The customer experience was ${rating >= 4 ? "excellent" : rating >= 3 ? "good" : "poor"}.`,
      author: `Customer ${i + 1}`,
      date: new Date().toISOString().split("T")[0],
    }
  })

  // Calculate average rating
  const averageRating = mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length

  return {
    reviews: mockReviews,
    averageRating,
    totalReviews: mockReviews.length,
  }
}

export function ReviewsCell({ row, column, onUpdate, businessName }: ReviewsCellProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [minRating, setMinRating] = useState(1)
  const [maxReviews, setMaxReviews] = useState(5)
  const value = row.getValue(column.id) as ReviewsData | undefined

  const handleFetch = async () => {
    if (!businessName) {
      setError("No business name provided in the source column")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const reviews = await fetchBusinessReviews(businessName, minRating, maxReviews)
      onUpdate(reviews)
    } catch (err) {
      setError("Failed to fetch reviews")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="h-3 w-3" fill={i < rating ? "currentColor" : "none"} />
    ))
  }

  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={value ? "default" : "outline"} className="h-6 px-2">
              <Star className="h-3 w-3 mr-1" />
              {value ? `${value.averageRating.toFixed(1)}★` : "No reviews"}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {value
              ? `${value.totalReviews} reviews with average rating ${value.averageRating.toFixed(1)}`
              : "Click to fetch reviews for this business"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 px-2" disabled={isLoading || !businessName}>
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : value ? (
              <span className="text-xs">View</span>
            ) : (
              <span className="text-xs">Fetch</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Reviews</h4>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                onClick={handleFetch}
                disabled={isLoading || !businessName}
              >
                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              </Button>
            </div>

            {error && <div className="text-sm text-destructive">{error}</div>}

            {!businessName && (
              <div className="text-sm text-muted-foreground">No business name provided in the source column</div>
            )}

            {businessName && (
              <div className="text-sm text-muted-foreground">
                Business: <span className="font-medium">{businessName}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="min-rating">Minimum Rating</Label>
                  <span className="text-sm">{minRating}★</span>
                </div>
                <Slider
                  id="min-rating"
                  min={1}
                  max={5}
                  step={1}
                  value={[minRating]}
                  onValueChange={(value) => setMinRating(value[0])}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-reviews">Max Reviews</Label>
                  <span className="text-sm">{maxReviews}</span>
                </div>
                <Slider
                  id="max-reviews"
                  min={1}
                  max={10}
                  step={1}
                  value={[maxReviews]}
                  onValueChange={(value) => setMaxReviews(value[0])}
                />
              </div>
            </div>

            {value && value.reviews.length > 0 && (
              <div className="max-h-60 overflow-y-auto space-y-3">
                {value.reviews.map((review, index) => (
                  <div key={index} className="rounded border p-2 text-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">{renderStars(review.rating)}</div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm">{review.text}</p>
                    <p className="text-xs text-muted-foreground">- {review.author}</p>
                  </div>
                ))}
              </div>
            )}

            {(!value || value.reviews.length === 0) && (
              <div className="rounded border p-2 text-sm text-center text-muted-foreground">No reviews available</div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
