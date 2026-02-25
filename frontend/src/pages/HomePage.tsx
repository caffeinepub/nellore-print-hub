import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Printer, Palette, Zap, Award } from 'lucide-react';
import SwipeContainer from '../components/SwipeContainer';
import PullToRefreshContainer from '../components/PullToRefreshContainer';
import { useQueryClient } from '@tanstack/react-query';

export default function HomePage() {
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries();
  };

  return (
    <PullToRefreshContainer onRefresh={handleRefresh}>
      <SwipeContainer>
        <div className="flex flex-col">
          {/* Hero Section */}
          <section
            className="relative bg-gradient-to-br from-primary/20 via-secondary/10 to-background py-16 md:py-24 px-4"
            style={{
              backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay',
            }}
          >
            <div className="container text-center space-y-6 max-w-3xl mx-auto">
              <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                Your Vision, <span className="text-primary">Printed</span> to Perfection
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Professional printing services in Nellore. From digital prints to large format banners, we bring your ideas to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/request-quote">
                  <Button size="lg" className="w-full sm:w-auto font-semibold text-base min-h-[48px] px-8">
                    Get Free Quote
                  </Button>
                </Link>
                <Link to="/gallery">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold text-base min-h-[48px] px-8">
                    View Portfolio
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-12 md:py-16 px-4 bg-muted/30">
            <div className="container">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
                Why Choose Us
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  {
                    icon: Printer,
                    title: 'Quality Printing',
                    description: 'State-of-the-art equipment for superior results',
                  },
                  {
                    icon: Zap,
                    title: 'Fast Turnaround',
                    description: 'Quick delivery without compromising quality',
                  },
                  {
                    icon: Palette,
                    title: 'Creative Design',
                    description: 'Expert designers to bring your vision to life',
                  },
                  {
                    icon: Award,
                    title: 'Best Prices',
                    description: 'Competitive rates with no hidden costs',
                  },
                ].map((feature, idx) => (
                  <Card key={idx} className="border-border hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Services Preview */}
          <section className="py-12 md:py-16 px-4">
            <div className="container">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Our Services</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Comprehensive printing solutions for all your business needs
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
                {[
                  {
                    title: 'Digital Printing',
                    description: 'High-quality prints for business cards, brochures, and more',
                    image: '/assets/generated/digital-icon.dim_256x256.png',
                  },
                  {
                    title: 'Flex & Banners',
                    description: 'Large format printing for outdoor advertising',
                    image: '/assets/generated/flex-icon.dim_256x256.png',
                  },
                  {
                    title: 'Offset Printing',
                    description: 'Bulk printing with consistent quality',
                    image: '/assets/generated/offset-icon.dim_256x256.png',
                  },
                  {
                    title: 'Design Services',
                    description: 'Professional graphic design and branding',
                    image: '/assets/generated/design-icon.dim_256x256.png',
                  },
                ].map((service, idx) => (
                  <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-4 p-6">
                        <img src={service.image} alt={service.title} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/services">
                  <Button variant="outline" size="lg" className="min-h-[48px] px-8">
                    View All Services
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="container text-center space-y-6 max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Ready to Start Your Project?
              </h2>
              <p className="text-lg text-muted-foreground">
                Get a free quote today and see how we can help bring your vision to life
              </p>
              <Link to="/request-quote">
                <Button size="lg" className="font-semibold text-base min-h-[48px] px-8">
                  Request a Quote
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </SwipeContainer>
    </PullToRefreshContainer>
  );
}
