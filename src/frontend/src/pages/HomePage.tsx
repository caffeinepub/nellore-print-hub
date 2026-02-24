import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Printer, Palette, Zap, Users } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Printer,
      title: 'Expert Design',
      description: "We don't just print; we create digital assets that sell.",
    },
    {
      icon: Zap,
      title: 'Modern Technology',
      description: 'Utilizing the latest in digital and offset machinery.',
    },
    {
      icon: Users,
      title: 'Customer Focused',
      description: 'Easy manual quotations and direct delivery to your mobile or email.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Your Vision, Our Print.{' '}
              <span className="text-primary">Quality You Can See</span>,{' '}
              <span className="text-secondary">Service You Can Trust</span>.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              From business cards to massive flex banners, Nellore Print Hub delivers premium printing and design
              solutions tailored to your brand. Fast, reliable, and professional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/request-quote">
                <Button size="lg" className="text-base font-semibold shadow-print">
                  Get Your Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="text-base font-semibold">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We combine expertise, technology, and customer service to deliver exceptional results.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive printing and design solutions for all your business needs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Digital Printing', icon: '/assets/generated/digital-icon.dim_256x256.png' },
              { name: 'Flex & Banners', icon: '/assets/generated/flex-icon.dim_256x256.png' },
              { name: 'Offset Printing', icon: '/assets/generated/offset-icon.dim_256x256.png' },
              { name: 'Design Services', icon: '/assets/generated/design-icon.dim_256x256.png' },
            ].map((service, index) => (
              <Card key={index} className="group hover:shadow-print transition-all cursor-pointer">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden bg-muted">
                    <img src={service.icon} alt={service.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/services">
              <Button variant="outline" size="lg">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Ready to Bring Your Vision to Life?</h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Get a custom quotation for your project. Our team will review your requirements and provide a detailed
            quote within 24 hours.
          </p>
          <Link to="/request-quote">
            <Button size="lg" variant="secondary" className="text-base font-semibold">
              Request a Quote Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
