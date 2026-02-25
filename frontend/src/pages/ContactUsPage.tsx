import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@tanstack/react-router';
import PullToRefreshContainer from '../components/PullToRefreshContainer';
import SwipeContainer from '../components/SwipeContainer';
import { useGetContactInfo } from '../hooks/useContactInfo';

export default function ContactUsPage() {
  const { data: contactInfo, isLoading, refetch } = useGetContactInfo();

  const handleRefresh = async () => {
    await refetch();
  };

  const defaultContact = {
    email: 'nelloreprinthubb@gmail.com',
    phone: '+91 98765 43210',
    location: 'Nellore, Andhra Pradesh, India',
  };

  const email = contactInfo?.email || defaultContact.email;
  const phone = contactInfo?.phone || defaultContact.phone;
  const location = contactInfo?.location || defaultContact.location;

  const contactCards = [
    {
      icon: Mail,
      title: 'Email Us',
      value: email,
      description: 'Send us an email anytime',
      action: `mailto:${email}`,
      actionLabel: 'Send Email',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: phone,
      description: 'Mon–Sat, 9 AM – 7 PM',
      action: `tel:${phone.replace(/\s/g, '')}`,
      actionLabel: 'Call Now',
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: location,
      description: 'Come see us in person',
      action: `https://maps.google.com/?q=${encodeURIComponent(location)}`,
      actionLabel: 'Get Directions',
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950/30',
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
                Contact <span className="text-primary">Us</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                We'd love to hear from you. Reach out for quotes, questions, or just to say hello!
              </p>
            </div>
          </section>

          {/* Contact Cards */}
          <section className="py-10 md:py-14 px-4">
            <div className="container max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactCards.map((card, idx) => (
                  <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                      <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center`}>
                        <card.icon className={`w-7 h-7 ${card.color}`} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{card.title}</h3>
                        <p className="text-sm text-muted-foreground">{card.description}</p>
                      </div>
                      {isLoading ? (
                        <Skeleton className="h-5 w-40" />
                      ) : (
                        <p className="font-medium text-sm break-all">{card.value}</p>
                      )}
                      <a href={card.action} target={card.title === 'Visit Us' ? '_blank' : undefined} rel="noopener noreferrer" className="w-full">
                        <Button variant="outline" className="w-full min-h-[44px]">
                          {card.actionLabel}
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Business Hours */}
          <section className="py-10 md:py-14 px-4 bg-muted/30">
            <div className="container max-w-2xl mx-auto">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3">
                  <Clock className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl font-bold">Business Hours</h2>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {[
                        { day: 'Monday – Friday', hours: '9:00 AM – 7:00 PM' },
                        { day: 'Saturday', hours: '9:00 AM – 5:00 PM' },
                        { day: 'Sunday', hours: 'Closed' },
                      ].map((row, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                          <span className="font-medium text-sm">{row.day}</span>
                          <span className={`text-sm ${row.hours === 'Closed' ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                            {row.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-10 md:py-14 px-4">
            <div className="container max-w-2xl mx-auto text-center space-y-6">
              <div className="flex items-center justify-center gap-3">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h2 className="font-display text-2xl md:text-3xl font-bold">Need a Quote?</h2>
              </div>
              <p className="text-muted-foreground">
                Fill out our quick quotation form and we'll get back to you within 24 hours.
              </p>
              <Link to="/request-quote">
                <Button size="lg" className="font-semibold text-base min-h-[48px] px-8">
                  Request a Free Quote
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </SwipeContainer>
    </PullToRefreshContainer>
  );
}
