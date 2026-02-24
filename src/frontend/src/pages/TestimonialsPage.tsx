import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useGetAllReviews, useGetReviewsByRating } from '../hooks/useReviews';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, MessageSquare } from 'lucide-react';
import { ExternalBlob } from '../lib/blobStorage';

export default function TestimonialsPage() {
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  
  const { data: allReviews, isLoading: allLoading } = useGetAllReviews();
  const { data: filteredReviews, isLoading: filteredLoading } = useGetReviewsByRating(
    BigInt(selectedRating as number),
    selectedRating !== 'all'
  );

  const reviews = selectedRating === 'all' ? allReviews : filteredReviews;
  const isLoading = selectedRating === 'all' ? allLoading : filteredLoading;

  const renderStars = (rating: bigint) => {
    const stars: React.ReactElement[] = [];
    const ratingNum = Number(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${i <= ratingNum ? 'fill-secondary text-secondary' : 'text-muted-foreground'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
        <div className="container text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Customer <span className="text-primary">Testimonials</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our clients say about our work
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <div className="flex gap-3">
              <Select
                value={selectedRating.toString()}
                onValueChange={(value) => setSelectedRating(value === 'all' ? 'all' : parseInt(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              <Link to="/submit-review">
                <Button>Leave a Review</Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-20 w-full mb-4" />
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <Card key={review.id} className="hover:shadow-print transition-shadow">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{review.customerName}</h3>
                        <div className="flex gap-1 mb-2">{renderStars(review.rating)}</div>
                      </div>
                      {review.imageUrl && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={ExternalBlob.fromURL(review.imageUrl).getDirectURL()}
                            alt="Review"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-foreground/90 leading-relaxed">{review.reviewText}</p>
                    <p className="text-sm text-muted-foreground">
                      Project: {review.projectType.charAt(0).toUpperCase() + review.projectType.slice(1)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
              <p className="text-muted-foreground mb-6">
                {selectedRating === 'all'
                  ? 'Be the first to leave a review!'
                  : `No ${selectedRating}-star reviews yet.`}
              </p>
              <Link to="/submit-review">
                <Button>Leave a Review</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
