"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProductReviews({ }: { productId: string }) {//productId 
  const [showReviewForm, setShowReviewForm] = useState(false)

  // In a real app, these would be fetched from an API based on the productId
  const reviews = [
    {
      id: "1",
      user: {
        name: "John D.",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      date: "2023-05-15",
      title: "Perfect fit and great quality",
      content:
        "These shoes are amazing! The quality is top-notch and they fit perfectly. I've been wearing them for a few weeks now and they're still in great condition. Highly recommend!",
    },
    {
      id: "2",
      user: {
        name: "Sarah M.",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 4,
      date: "2023-04-22",
      title: "Great shoes, but run a bit small",
      content:
        "I love these shoes, but they run a bit small. I would recommend going half a size up. Other than that, they're great quality and look amazing.",
    },
    {
      id: "3",
      user: {
        name: "Michael T.",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      date: "2023-03-10",
      title: "Best purchase ever!",
      content:
        "I've been looking for these shoes for months and finally got my hands on them. They're even better in person than in the pictures. The materials are premium and they're super comfortable.",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Customer Reviews ({reviews.length})</h3>
        <Button variant="outline" onClick={() => setShowReviewForm(!showReviewForm)}>
          {showReviewForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {showReviewForm && (
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Write Your Review</h4>
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Stars - Excellent</SelectItem>
                <SelectItem value="4">4 Stars - Good</SelectItem>
                <SelectItem value="3">3 Stars - Average</SelectItem>
                <SelectItem value="2">2 Stars - Poor</SelectItem>
                <SelectItem value="1">1 Star - Very Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Review Title</label>
            <input
              type="text"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Summarize your review"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Review</label>
            <Textarea placeholder="Write your review here..." className="min-h-[100px]" />
          </div>
          <Button>Submit Review</Button>
        </div>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={review.user.avatar} alt={review.user.name} />
                <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.user.name}</span>
                  <span className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
                </div>
                <div className="flex">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                </div>
                <h4 className="font-medium">{review.title}</h4>
                <p className="text-sm">{review.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="outline">Load More Reviews</Button>
      </div>
    </div>
  )
}
