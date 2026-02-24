import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Printer, Image, BookOpen, Palette } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: '/assets/generated/digital-icon.dim_256x256.png',
      title: 'Digital Printing',
      tagline: 'Bring your small-scale projects to life with vibrant colors.',
      items: [
        'High-quality Flyers & Leaflets',
        'Professional Business Cards',
        'Custom Books & Magazines',
        'Official Letterheads & Envelopes',
      ],
      color: 'primary',
    },
    {
      icon: '/assets/generated/flex-icon.dim_256x256.png',
      title: 'Flex & Banner Printing',
      tagline: 'Go big and get noticed with our durable outdoor solutions.',
      items: [
        'Normal & Star Banners',
        'Premium Flex Printing',
        'Canvas Prints',
        'Vinyl (Black/Grey Backing)',
        'Custom Die-cut Stickers',
      ],
      color: 'secondary',
    },
    {
      icon: '/assets/generated/offset-icon.dim_256x256.png',
      title: 'Offset Printing',
      tagline: 'The most cost-effective solution for high-volume orders.',
      items: [
        'Bulk Flyers & Magazines',
        '1, 2, and 4 Color Printing',
        'Newspaper Printing & Books',
      ],
      color: 'chart-3',
    },
    {
      icon: '/assets/generated/design-icon.dim_256x256.png',
      title: 'Creative Design Services',
      tagline: 'Our designers make sure your brand stands out in the crowd.',
      items: [
        'Professional Logo Design',
        'Company Digital Product Design',
        'Social Media Graphics',
        'Custom Templates',
      ],
      color: 'chart-4',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20 md:py-28">
        <div className="container text-center space-y-6">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive printing and design solutions tailored to your business needs
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-2 hover:shadow-print transition-all">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img src={service.icon} alt={service.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                      <p className="text-muted-foreground">{service.tagline}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-foreground/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container text-center space-y-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Request a custom quotation for your project and let us bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/request-quote">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2">
                Request Quote
              </button>
            </a>
            <a href="/gallery">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 py-2">
                View Portfolio
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
