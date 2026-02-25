import React, { useState } from 'react';
import { Star, Upload, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useNavigate } from '@tanstack/react-router';
import { useAddReview } from '../hooks/useReviews';
import { toast } from 'sonner';
import { haptics } from '../utils/haptics';
import { ServiceType } from '../backend';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../translations';

export default function SubmitReviewPage() {
  const navigate = useNavigate();
  const { mutateAsync: addReview, isPending } = useAddReview();
  const { language } = useLanguage();
  const t = getTranslations(language);

  const [name, setName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [projectType, setProjectType] = useState<ServiceType | ''>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const projectTypes = [
    { value: ServiceType.digital, label: t.quotation.digital },
    { value: ServiceType.banner, label: t.quotation.banner },
    { value: ServiceType.offset, label: t.quotation.offset },
    { value: ServiceType.design, label: t.quotation.design },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t.submitReview.errorName;
    if (!reviewText.trim()) newErrors.reviewText = t.submitReview.errorReview;
    if (!rating) newErrors.rating = t.submitReview.errorRating;
    if (!projectType) newErrors.projectType = t.submitReview.errorProjectType;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB.');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      haptics.error();
      return;
    }
    try {
      let imageUrl: string | null = null;
      if (imageFile && imagePreview) {
        imageUrl = imagePreview;
      }
      await addReview({
        customerName: name.trim(),
        reviewText: reviewText.trim(),
        rating: rating, // number, as expected by useAddReview
        imageUrl,
        projectType: projectType as ServiceType,
      });
      haptics.success();
      toast.success(t.submitReview.success);
      navigate({ to: '/testimonials' });
    } catch {
      haptics.error();
      toast.error('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">{t.submitReview.title}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="review-name">{t.submitReview.yourName}</Label>
          <Input
            id="review-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.submitReview.yourNamePlaceholder}
            className="h-12"
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        {/* Rating */}
        <div className="space-y-1.5">
          <Label>{t.submitReview.rating}</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && <p className="text-xs text-destructive">{errors.rating}</p>}
        </div>

        {/* Project Type */}
        <div className="space-y-1.5">
          <Label htmlFor="project-type">{t.submitReview.projectType}</Label>
          <select
            id="project-type"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value as ServiceType)}
            className="w-full h-12 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">-- {t.submitReview.projectType} --</option>
            {projectTypes.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.projectType && <p className="text-xs text-destructive">{errors.projectType}</p>}
        </div>

        {/* Review Text */}
        <div className="space-y-1.5">
          <Label htmlFor="review-text">{t.submitReview.reviewText}</Label>
          <Textarea
            id="review-text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={t.submitReview.reviewTextPlaceholder}
            className="min-h-[120px]"
          />
          {errors.reviewText && <p className="text-xs text-destructive">{errors.reviewText}</p>}
        </div>

        {/* Image Upload */}
        <div className="space-y-1.5">
          <Label>{t.submitReview.addPhoto}</Label>
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="absolute top-2 right-2 bg-background/80 rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-6 h-6 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">{t.submitReview.addPhoto}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>

        <Button type="submit" className="w-full h-12" disabled={isPending}>
          {isPending ? t.submitReview.submitting : t.submitReview.submit}
        </Button>
      </form>
    </div>
  );
}
