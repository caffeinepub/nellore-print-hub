import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { CheckCircle2 } from 'lucide-react';
import SwipeContainer from '../components/SwipeContainer';
import PullToRefreshContainer from '../components/PullToRefreshContainer';

export default function ServicesPage() {
  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const services = [
    {
      title: 'Digital Printing',
      description:
        'High-quality digital printing for all your business and personal needs. We use the latest digital printing technology to deliver sharp, vibrant, and accurate color reproduction on a wide range of media.',
      features: [
        'Business Cards & Letterheads',
        'Flyers, Brochures & Pamphlets',
        'Posters & Standees',
        'Stickers & Labels',
        'Envelopes & Notepads',
      ],
      image: '/assets/generated/digital-icon.dim_256x256.png',
      cta: 'Get Digital Print Quote',
    },
    {
      title: 'Flex & Banner Printing',
      description:
        'Large-format flex and banner printing for outdoor advertising, events, and promotional displays. We deliver weather-resistant, eye-catching prints that make your brand impossible to miss.',
      features: [
        'Flex & Vinyl Banners',
        'Backlit & Sunlit Flex',
        'Mesh & Perforated Banners',
        'Event & Stage Backdrops',
        'Hoarding & Signage Boards',
      ],
      image: '/assets/generated/flex-icon.dim_256x256.png',
      cta: 'Get Banner Quote',
    },
    {
      title: 'Offset Printing',
      description:
        'Cost-effective, high-volume offset printing with consistent quality and rich color accuracy. Ideal for bulk orders where precision and economy matter most.',
      features: [
        'Magazines & Catalogs',
        'Books & Booklets',
        'Packaging & Boxes',
        'Calendars & Diaries',
        'Large Volume Bulk Orders',
      ],
      image: '/assets/generated/offset-icon.dim_256x256.png',
      cta: 'Get Offset Print Quote',
    },
    {
      title: 'Creative Design Services',
      description:
        'Professional graphic design and branding services to help your business stand out. Our creative team crafts compelling visuals that communicate your brand story effectively.',
      features: [
        'Logo & Brand Identity Design',
        'Marketing Collateral Design',
        'Social Media Graphics',
        'Packaging & Label Design',
        'Print-Ready Artwork Preparation',
      ],
      image: '/assets/generated/design-icon.dim_256x256.png',
      cta: 'Request Design Services',
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
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <CardTitle className="text-2xl">{service.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                        What We Offer
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.features.map((feature, featureIdx) => (
                          <div key={featureIdx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Link to="/request-quote">
                      <Button className="w-full sm:w-auto min-h-[44px] font-semibold">
                        {service.cta}
                      </Button>
                    </Link>
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
