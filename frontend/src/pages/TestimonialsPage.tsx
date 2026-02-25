import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useGetAllReviews } from '../hooks/useReviews';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Star, Loader2, LogIn } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import SkeletonCard from '../components/SkeletonCard';
import SwipeContainer from '../components/SwipeContainer';
import PullToRefreshContainer from '../components/PullToRefreshContainer';

export default function TestimonialsPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: reviews, isLoading, refetch } = useGetAllReviews();
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');

  const isAuthenticated = !!identity;

  const ratingFilters = [
    { value: 'all' as const, label: 'All Ratings' },
    { value: 5, label: '5 Stars' },
    { value: 4, label: '4 Stars' },
    { value: 3, label: '3 Stars' },
  ];

  const filteredReviews =
    selectedRating === 'all'
      ? reviews
      : reviews?.filter((r) => Number(r.rating) === selectedRating);

  const handleRefresh = async () => {
    await refetch();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col">
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
          <div className="container text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Customer <span className="text-primary">Testimonials</span>
            </h1>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-2xl">
            <Alert>
              <LogIn className="h-5 w-5" />
              <AlertTitle>Sign in Required</AlertTitle>
              <AlertDescription className="mt-2">
                Please sign in to view customer testimonials.
              </AlertDescription>
              <div className="mt-4">
                <Button onClick={login} disabled={loginStatus === 'logging-in'}>
                  {loginStatus === 'logging-in' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </div>
            </Alert>
          </div>
        </section>
      </div>
    );
  }

  return (
    <SwipeContainer>
      <PullToRefreshContainer onRefresh={handleRefresh}>
        <div className="flex flex-col min-h-screen">
          <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12 md:py-16 px-4">
            <div className="container text-center space-y-4 max-w-3xl mx-auto">
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                Customer <span className="text-primary">Testimonials</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                See what our satisfied customers have to say
              </p>
            </div>
          </section>

          <section className="py-8 md:py-12 px-4 flex-1">
            <div className="container max-w-4xl">
              <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                {ratingFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={selectedRating === filter.value ? 'default' : 'outline'}
                    onClick={() => setSelectedRating(filter.value)}
                    className="min-h-[44px] whitespace-nowrap"
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>

              {isLoading ? (
                <div className="space-y-6 animate-fade-in">
                  {[...Array(4)].map((_, idx) => (
                    <SkeletonCard key={idx} variant="review" />
                  ))}
                </div>
              ) : filteredReviews && filteredReviews.length > 0 ? (
                <div className="space-y-6 animate-fade-in">
                  {filteredReviews.map((review) => (
                    <Card key={review.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{review.customerName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Number(review.rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-muted-foreground'
                                    }`}
                                  />
                                ))}
                              </div>
                              <Badge variant="secondary" className="capitalize">
                                {review.projectType}
                              </Badge>
                            </div>
                          </div>
                          {review.imageUrl && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={review.imageUrl}
                                alt="Review"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-muted-foreground">{review.reviewText}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(Number(review.submissionDate) / 1000000).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg mb-6">
                    No reviews found with this rating
                  </p>
                </div>
              )}

              <div className="mt-12 text-center">
                <Link to="/submit-review">
                  <Button size="lg" className="min-h-[48px] px-8">
                    Submit Your Review
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </PullToRefreshContainer>
    </SwipeContainer>
  );
}
