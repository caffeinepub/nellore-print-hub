import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Printer, Image as ImageIcon, FileText, Palette } from 'lucide-react';
import SwipeContainer from '../components/SwipeContainer';
import PullToRefreshContainer from '../components/PullToRefreshContainer';

export default function ServicesPage() {
  const handleRefresh = async () => {
    // Services page is mostly static, minimal refresh needed
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const services = [
    {
      icon: Printer,
      title: 'Digital Printing',
      description: 'High-quality digital printing for business cards, flyers, brochures, and promotional materials.',
      features: ['Business Cards', 'Flyers & Brochures', 'Posters', 'Letterheads', 'Envelopes'],
      image: '/assets/generated/digital-icon.dim_256x256.png',
    },
    {
      icon: ImageIcon,
      title: 'Flex & Banner Printing',
      description: 'Large format printing for outdoor advertising, events, and promotional displays.',
      features: ['Flex Banners', 'Vinyl Banners', 'Mesh Banners', 'Backlit Displays', 'Event Signage'],
      image: '/assets/generated/flex-icon.dim_256x256.png',
    },
    {
      icon: FileText,
      title: 'Offset Printing',
      description: 'Cost-effective bulk printing with consistent quality for large volume orders.',
      features: ['Magazines', 'Catalogs', 'Books', 'Packaging', 'Large Volume Orders'],
      image: '/assets/generated/offset-icon.dim_256x256.png',
    },
    {
      icon: Palette,
      title: 'Creative Design Services',
      description: 'Professional graphic design and branding services to make your business stand out.',
      features: ['Logo Design', 'Brand Identity', 'Marketing Materials', 'Social Media Graphics', 'Packaging Design'],
      image: '/assets/generated/design-icon.dim_256x256.png',
    },
  ];

  return (
    <PullToRefreshContainer onRefresh={handleRefresh}>
      <SwipeContainer>
        <div className="flex flex-col">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12 md:py-16 px-4">
            <div className="container text-center space-y-4 max-w-3xl mx-auto">
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                Our <span className="text-primary">Services</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Comprehensive printing and design solutions tailored to your business needs
              </p>
            </div>
          </section>

          {/* Services Grid */}
          <section className="py-12 md:py-16 px-4">
            <div className="container space-y-8 md:space-y-12">
              {services.map((service, idx) => (
                <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 mb-3">
                      <img src={service.image} alt={service.title} className="w-16 h-16 rounded-lg object-cover" />
                      <CardTitle className="text-2xl">{service.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                        What We Offer
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.features.map((feature, featureIdx) => (
                          <div key={featureIdx} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 md:py-16 px-4 bg-muted/30">
            <div className="container text-center space-y-6 max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Need a Custom Solution?
              </h2>
              <p className="text-lg text-muted-foreground">
                Contact us for a personalized quote tailored to your specific requirements
              </p>
              <Link to="/request-quote">
                <Button size="lg" className="font-semibold text-base min-h-[48px] px-8">
                  Get Free Quote
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </SwipeContainer>
    </PullToRefreshContainer>
  );
}
