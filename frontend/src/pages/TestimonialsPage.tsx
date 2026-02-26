import React, { useState, useCallback } from 'react';
import { Star, PenLine, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllReviews } from '../hooks/useReviews';
import SwipeContainer from '../components/SwipeContainer';
import PullToRefreshContainer from '../components/PullToRefreshContainer';
import SkeletonCard from '../components/SkeletonCard';
import { useLanguage } from '../contexts/LanguageContext';

export default function TestimonialsPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const { data: reviews = [], isLoading, refetch } = useGetAllReviews();
  const { t } = useLanguage();

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const filtered = ratingFilter
    ? reviews.filter((r) => Number(r.rating) === ratingFilter)
    : reviews;

  const ratingFilters = [
    { label: t('reviews.filterAll'), value: null },
    { label: '5 ★', value: 5 },
    { label: '4 ★', value: 4 },
    { label: '3 ★', value: 3 },
    { label: '2 ★', value: 2 },
    { label: '1 ★', value: 1 },
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-4">
        <Star className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-bold text-foreground">{t('reviews.title')}</h2>
        <p className="text-muted-foreground">{t('reviews.loginToView')}</p>
        <Button onClick={() => login()} className="gap-2">
          <LogIn className="w-4 h-4" />
          {t('common.signIn')}
        </Button>
      </div>
    );
  }

  return (
    <SwipeContainer>
      <PullToRefreshContainer onRefresh={handleRefresh}>
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">{t('reviews.title')}</h1>
              <p className="text-muted-foreground text-sm mt-1">{t('reviews.subtitle')}</p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate({ to: '/submit-review' })}
              className="gap-2 shrink-0"
            >
              <PenLine className="w-4 h-4" />
              <span className="hidden sm:inline">{t('reviews.writeReview')}</span>
            </Button>
          </div>

          {/* Rating Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {ratingFilters.map(({ label, value }) => (
              <button
                key={label}
                onClick={() => setRatingFilter(value)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  ratingFilter === value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} variant="review" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              {t('reviews.noReviews')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((review) => (
                <div key={review.id} className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{review.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          Number(review.submissionDate) / 1_000_000
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Number(review.rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.reviewText}</p>
                  {review.imageUrl && (
                    <img
                      src={review.imageUrl}
                      alt="Review"
                      className="mt-3 rounded-xl w-full h-32 object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </PullToRefreshContainer>
    </SwipeContainer>
  );
}
