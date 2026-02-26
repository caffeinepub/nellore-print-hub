import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetServiceImages } from '../hooks/useServiceImages';
import { useGetVideoClips } from '../hooks/useVideoClips';
import { useGetAdminContent } from '../hooks/useAdminContent';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Printer, ArrowRight, Play,
  Zap, Shield, Palette, Monitor
} from 'lucide-react';

const STATIC_SAMPLES = [
  {
    src: '/assets/generated/print-sample-banner.dim_800x450.png',
    label: 'Banner Printing',
    teLabel: 'బ్యానర్ ప్రింటింగ్',
  },
  {
    src: '/assets/generated/print-sample-business-card.dim_800x450.png',
    label: 'Business Cards',
    teLabel: 'బిజినెస్ కార్డులు',
  },
  {
    src: '/assets/generated/print-sample-flex.dim_800x450.png',
    label: 'Flex Printing',
    teLabel: 'ఫ్లెక్స్ ప్రింటింగ్',
  },
  {
    src: '/assets/generated/print-sample-brochure.dim_800x450.png',
    label: 'Brochures',
    teLabel: 'బ్రోచర్లు',
  },
];

const FEATURES = [
  { icon: Zap, en: 'Fast Turnaround', te: 'వేగవంతమైన డెలివరీ', desc: 'Same day & express printing available', teDesc: 'అదే రోజు ప్రింటింగ్ అందుబాటులో ఉంది' },
  { icon: Shield, en: 'Quality Assured', te: 'నాణ్యత హామీ', desc: 'Premium materials & vibrant colors', teDesc: 'ప్రీమియం మెటీరియల్స్ & వైబ్రెంట్ రంగులు' },
  { icon: Palette, en: 'Custom Design', te: 'కస్టమ్ డిజైన్', desc: 'Professional design services included', teDesc: 'ప్రొఫెషనల్ డిజైన్ సేవలు అందుబాటులో' },
  { icon: Monitor, en: 'Digital & Offset', te: 'డిజిటల్ & ఆఫ్‌సెట్', desc: 'All printing technologies under one roof', teDesc: 'అన్ని ప్రింటింగ్ సేవలు ఒకే చోట' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { data: serviceImages } = useGetServiceImages();
  const { data: videoClips } = useGetVideoClips();
  const { data: adminContent } = useGetAdminContent();

  const allSampleImages = serviceImages && serviceImages.length > 0
    ? serviceImages.map((img) => ({ src: img.imageUrl, label: img.serviceType, teLabel: img.description }))
    : STATIC_SAMPLES;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-8 pb-12 px-4">
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/generated/hero-bg.dim_1920x1080.png')" }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 text-xs">
            Nellore's Premier Printing Hub / నెల్లూరు ప్రీమియర్ ప్రింటింగ్ హబ్
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground leading-tight mb-2">
            Magic Hub Nellore
          </h1>
          <p className="text-lg text-primary font-semibold mb-1">మేజిక్ హబ్ నెల్లూరు</p>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-2">
            Your one-stop printing & design solution
          </p>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto mb-8">
            మీ అన్ని ప్రింటింగ్ & డిజైన్ అవసరాలకు ఒకే చోట పరిష్కారం
          </p>

          {/* Promo Banner from Admin */}
          {adminContent?.homepageContent && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 text-sm text-foreground max-w-2xl mx-auto">
              <p className="whitespace-pre-wrap">{adminContent.homepageContent}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => navigate({ to: '/request-quote' })} className="gap-2">
              <Printer className="w-5 h-5" />
              Get Quote / కోటేషన్ పొందండి
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate({ to: '/gallery' })}>
              View Gallery / గ్యాలరీ చూడండి
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Why Choose Us?</h2>
            <p className="text-primary font-medium">మాను ఎందుకు ఎంచుకోవాలి?</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <Card key={f.en} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-sm text-foreground">{f.en}</p>
                  <p className="text-xs text-primary mb-1">{f.te}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                  <p className="text-xs text-muted-foreground/70">{f.teDesc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Printing Samples */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Our Printing Samples</h2>
            <p className="text-primary font-medium">మా ప్రింటింగ్ నమూనాలు</p>
            <p className="text-muted-foreground text-sm mt-1">
              See the quality of our work / మా పని నాణ్యత చూడండి
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allSampleImages.map((sample, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate({ to: '/gallery' })}
              >
                <img
                  src={sample.src}
                  alt={sample.label}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/generated/print-sample-banner.dim_800x450.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <div>
                    <p className="text-white text-sm font-semibold">{sample.label}</p>
                    <p className="text-white/80 text-xs">{sample.teLabel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      {videoClips && videoClips.length > 0 && (
        <section className="py-10 px-4 bg-card/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Watch Our Work</h2>
              <p className="text-primary font-medium">మా పని చూడండి</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videoClips.map((clip) => (
                <div key={clip.id} className="group relative overflow-hidden rounded-xl shadow-md">
                  {clip.thumbnailUrl ? (
                    <div className="relative aspect-video">
                      <img
                        src={clip.thumbnailUrl}
                        alt={clip.description}
                        className="w-full h-full object-cover"
                      />
                      <a
                        href={clip.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <Play className="w-6 h-6 text-primary ml-1" />
                        </div>
                      </a>
                    </div>
                  ) : (
                    <a
                      href={clip.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-video bg-muted flex items-center justify-center rounded-xl hover:bg-muted/80 transition-colors"
                    >
                      <div className="text-center">
                        <Play className="w-10 h-10 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">{clip.description}</p>
                        <p className="text-xs text-muted-foreground">{clip.serviceType}</p>
                      </div>
                    </a>
                  )}
                  {clip.description && (
                    <div className="p-3">
                      <p className="text-sm font-medium">{clip.description}</p>
                      <p className="text-xs text-muted-foreground">{clip.serviceType}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Preview */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Our Services</h2>
            <p className="text-primary font-medium">మా సేవలు</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '/assets/generated/digital-icon.dim_256x256.png', en: 'Digital Printing', te: 'డిజిటల్ ప్రింటింగ్' },
              { icon: '/assets/generated/flex-icon.dim_256x256.png', en: 'Banner / Flex', te: 'బ్యానర్ / ఫ్లెక్స్' },
              { icon: '/assets/generated/offset-icon.dim_256x256.png', en: 'Offset Printing', te: 'ఆఫ్‌సెట్ ప్రింటింగ్' },
              { icon: '/assets/generated/design-icon.dim_256x256.png', en: 'Design Services', te: 'డిజైన్ సేవలు' },
            ].map((svc) => (
              <Card
                key={svc.en}
                className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 group"
                onClick={() => navigate({ to: '/services' })}
              >
                <CardContent className="p-4 text-center">
                  <img
                    src={svc.icon}
                    alt={svc.en}
                    className="w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform"
                  />
                  <p className="font-semibold text-sm text-foreground">{svc.en}</p>
                  <p className="text-xs text-primary">{svc.te}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button variant="outline" onClick={() => navigate({ to: '/services' })}>
              View All Services / అన్ని సేవలు చూడండి
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to Print?</h2>
          <p className="text-primary-foreground/80 font-medium mb-1">ప్రింట్ చేయడానికి సిద్ధంగా ఉన్నారా?</p>
          <p className="text-primary-foreground/70 text-sm mb-6">
            Get a free quote today. Fast, quality printing in Nellore.
            <span className="block">ఈరోజే ఉచిత కోటేషన్ పొందండి. నెల్లూరులో వేగవంతమైన, నాణ్యమైన ప్రింటింగ్.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate({ to: '/request-quote' })}
            >
              Request Quote / కోటేషన్ అడగండి
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate({ to: '/contact' })}
            >
              Contact Us / సంప్రదించండి
            </Button>
          </div>
        </div>
      </section>

      {/* Customer Portal CTA */}
      <section className="py-8 px-4 bg-card/50">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Track Your Orders
            <span className="block text-sm font-normal text-muted-foreground">మీ ఆర్డర్లు ట్రాక్ చేయండి</span>
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Register or login to view your quotation history and order status.
            <span className="block text-xs">మీ కోటేషన్ చరిత్ర మరియు ఆర్డర్ స్థితి చూడటానికి నమోదు చేయండి లేదా లాగిన్ అవ్వండి.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate({ to: '/customer/login' })}>
              Customer Login / కస్టమర్ లాగిన్
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/customer/register' })}>
              Register / నమోదు చేయండి
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
