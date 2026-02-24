import { useState } from 'react';
import { useCalculateDeliveryFee } from '../hooks/useDelivery';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck, MapPin, Calculator } from 'lucide-react';

export default function DeliveryInfoPage() {
  const [distance, setDistance] = useState('');
  const [calculatedFee, setCalculatedFee] = useState<bigint | null>(null);
  const calculateFee = useCalculateDeliveryFee();

  const handleCalculate = async () => {
    const distanceNum = parseFloat(distance);
    if (isNaN(distanceNum) || distanceNum <= 0) {
      return;
    }

    try {
      const fee = await calculateFee.mutateAsync(BigInt(Math.floor(distanceNum)));
      setCalculatedFee(fee);
    } catch (error) {
      console.error('Failed to calculate delivery fee:', error);
    }
  };

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
        <div className="container text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Delivery <span className="text-primary">Information</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fast, reliable delivery within our service area
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-4xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Service Area
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">
                We provide <strong>local delivery service within a 35 km radius</strong> from our facility in Nellore.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Coverage Includes:</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Nellore City and surrounding areas</li>
                  <li>• Industrial zones and business districts</li>
                  <li>• Residential neighborhoods within range</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Delivery Fee Calculator
              </CardTitle>
              <CardDescription>
                Calculate your delivery cost based on distance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (in kilometers)</Label>
                  <div className="flex gap-3">
                    <Input
                      id="distance"
                      type="number"
                      min="0"
                      max="35"
                      step="0.1"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      placeholder="Enter distance"
                      className="flex-1"
                    />
                    <Button onClick={handleCalculate} disabled={calculateFee.isPending || !distance}>
                      Calculate
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maximum delivery distance: 35 km
                  </p>
                </div>

                {calculatedFee !== null && (
                  <div className="bg-primary/10 border-2 border-primary/20 rounded-lg p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Estimated Delivery Fee</p>
                    <p className="text-3xl font-bold text-primary">
                      ₹{(Number(calculatedFee) / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      For {distance} km distance
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t space-y-3">
                <h3 className="font-semibold">Transparent Pricing</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Fair per-kilometer rate with no hidden charges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Delivery fee calculated based on actual distance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Free packaging and handling included</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Process</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                    1
                  </span>
                  <span>Your order is carefully packaged and prepared for delivery</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                    2
                  </span>
                  <span>We contact you to confirm delivery address and schedule</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                    3
                  </span>
                  <span>Your order is delivered safely to your location</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
