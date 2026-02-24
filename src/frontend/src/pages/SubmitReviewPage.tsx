import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAddReview } from '../hooks/useReviews';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Upload, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { ServiceType } from '../backend';
import { ExternalBlob } from '../lib/blobStorage';
import BottomSheetSelect from '../components/BottomSheetSelect';
import { haptics } from '../utils/haptics';

export default function SubmitReviewPage() {
  const navigate = useNavigate();
  const addReview = useAddReview();

  const [customerName, setCustomerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [projectType, setProjectType] = useState<ServiceType | ''>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const projectOptions = [
    { value: 'digital', label: 'Digital Printing' },
    { value: 'banner', label: 'Flex & Banner Printing' },
    { value: 'offset', label: 'Offset Printing' },
    { value: 'design', label: 'Creative Design Services' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !reviewText.trim() || !projectType) {
      haptics.error();
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
        imageUrl = blob.getDirectURL();
      }

      await addReview.mutateAsync({
        customerName,
        reviewText,
        rating: BigInt(rating),
        imageUrl,
        projectType: projectType as ServiceType,
      });

      haptics.success();
      toast.success('Review submitted successfully!');
      navigate({ to: '/testimonials' });
    } catch (error) {
      haptics.error();
      toast.error('Failed to submit review');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12 md:py-16 px-4">
        <div className="container text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Leave a <span className="text-primary">Review</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your experience with Nellore Print Hub
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12 px-4 flex-1">
        <div className="container max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Your Feedback</CardTitle>
              <CardDescription>
                Help others by sharing your experience with our services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    inputMode="text"
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rating *</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          haptics.tap();
                          setRating(star);
                        }}
                        className="focus:outline-none focus:ring-2 focus:ring-primary rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= rating ? 'fill-secondary text-secondary' : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <BottomSheetSelect
                  label="Project Type"
                  value={projectType}
                  onValueChange={(value) => setProjectType(value as ServiceType)}
                  options={projectOptions}
                  placeholder="Select project type"
                  required
                />

                <div className="space-y-2">
                  <Label htmlFor="review">Your Review *</Label>
                  <Textarea
                    id="review"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Tell us about your experience..."
                    rows={5}
                    required
                    className="text-base resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Project Photo (Optional)</Label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 min-w-[44px] min-h-[44px]"
                        onClick={removeImage}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="absolute bottom-2 left-2 right-2 bg-background/90 rounded-full h-2">
                          <div
                            className="bg-primary h-full rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <Label htmlFor="image" className="cursor-pointer text-primary hover:underline">
                        Click to upload image
                      </Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full min-h-[48px] text-base" size="lg" disabled={addReview.isPending}>
                  {addReview.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
