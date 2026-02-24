import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Award, Cpu, Heart } from 'lucide-react';

export default function AboutPage() {
  const benefits = [
    {
      icon: Award,
      title: 'Expert Design',
      description: "We don't just print; we create digital assets that sell.",
    },
    {
      icon: Cpu,
      title: 'Modern Technology',
      description: 'Utilizing the latest in digital and offset machinery.',
    },
    {
      icon: Heart,
      title: 'Customer Focused',
      description: 'Easy manual quotations and direct delivery to your mobile or email.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/generated/about-bg.dim_1200x600.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-background/85" />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              About <span className="text-primary">Nellore Print Hub</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Where your brand's identity takes physical form
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed text-foreground/90">
              Welcome to <strong>Nellore Print Hub</strong>, where your brand's identity takes physical form. We
              specialize in high-quality digital, offset, and flex printing, backed by the creative expertise of{' '}
              <strong>Magic Advertising</strong>. Our mission is to provide businesses with top-tier marketing
              materials that leave a lasting impression.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We bring together expertise, innovation, and dedication to serve you better.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6 space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary">
                    <benefit.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Our Commitment</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: 'Quality First', description: 'Every print job meets our rigorous quality standards.' },
              { title: 'Fast Turnaround', description: 'We understand deadlines and deliver on time, every time.' },
              { title: 'Competitive Pricing', description: 'Premium quality at prices that work for your budget.' },
              { title: 'Personal Service', description: 'Direct communication and support throughout your project.' },
            ].map((value, index) => (
              <div key={index} className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
