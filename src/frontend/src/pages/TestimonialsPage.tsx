import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useGetAllReviews } from '../hooks/useReviews';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import SwipeContainer from '../components/SwipeContainer';
import PullToRefreshContainer from '../components/PullToRefreshContainer';
import SkeletonCard from '../components/SkeletonCard';
import { useQueryClient } from '@tanstack/react-query';

export default function TestimonialsPage() {
  const { data: reviews, isLoading } = useGetAllReviews();
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['reviews'] });
  };

  const filteredReviews =
    selectedRating === 'all'
      ? reviews
      : reviews?.filter((r) => Number(r.rating) === selectedRating);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'fill-secondary text-secondary' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  return (
    <PullToRefreshContainer onRefresh={handleRefresh}>
      <SwipeContainer>
        <div className="flex flex-col">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12 md:py-16 px-4">
            <div className="container text-center space-y-4 max-w-3xl mx-auto">
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                Customer <span className="text-primary">Reviews</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                See what our clients say about our printing services
              </p>
            </div>
          </section>

          {/* Rating Filter */}
          <section className="sticky top-14 z-30 bg-background/95 backdrop-blur-lg border-b border-border py-3 px-4">
            <div className="container">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Button
                  variant={selectedRating === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedRating('all')}
                  className="whitespace-nowrap min-h-[44px] px-6 text-base"
                >
                  All Reviews
                </Button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={selectedRating === rating ? 'default' : 'outline'}
                    onClick={() => setSelectedRating(rating)}
                    className="whitespace-nowrap min-h-[44px] px-6 text-base flex items-center gap-1"
                  >
                    {rating} <Star className="w-4 h-4 fill-current" />
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* Reviews Grid */}
          <section className="py-8 md:py-12 px-4">
            <div className="container">
              {isLoading ? (
                <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
                  {[...Array(4)].map((_, idx) => (
                    <SkeletonCard key={idx} variant="review" />
                  ))}
                </div>
              ) : filteredReviews && filteredReviews.length > 0 ? (
                <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
                  {filteredReviews.map((review) => (
                    <Card key={review.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{review.customerName}</h3>
                            <div className="flex gap-1 mb-2">{renderStars(Number(review.rating))}</div>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-muted rounded-full">
                              {review.projectType}
                            </span>
                          </div>
                          {review.imageUrl && (
                            <img
                              src={review.imageUrl}
                              alt="Project"
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          )}
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{review.reviewText}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(Number(review.submissionDate) / 1000000).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">No reviews found with this rating</p>
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 md:py-16 px-4 bg-muted/30">
            <div className="container text-center space-y-6 max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Share Your Experience
              </h2>
              <p className="text-lg text-muted-foreground">
                Help others by leaving a review of our services
              </p>
              <Link to="/submit-review">
                <Button size="lg" className="font-semibold text-base min-h-[48px] px-8">
                  Write a Review
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </SwipeContainer>
    </PullToRefreshContainer>
  );
}
