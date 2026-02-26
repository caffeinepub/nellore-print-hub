import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, CheckCircle, Printer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const serviceData = [
  {
    id: 'design',
    sampleImage: '/assets/generated/service-design.dim_800x500.png',
    title: 'Design Services',
    description: 'Professional graphic design services to create stunning print-ready artwork for all your materials.',
    items: [
      'Logo Design',
      'Brand Identity',
      'Marketing Materials',
      'Social Media Graphics',
      'Packaging Design',
      'Photo Editing',
    ],
    badge: 'Creative',
    badgeColor: 'bg-[oklch(0.94_0.06_75)] text-[oklch(0.40_0.16_68)] border-[oklch(0.82_0.10_72)]',
    tagline: null,
  },
  {
    id: 'digital',
    sampleImage: '/assets/generated/service-digital-printing.dim_800x500.png',
    title: 'Digital Printing',
    description: 'High-resolution digital prints for all your business needs with vibrant colors and sharp details.',
    items: [
      'Business Cards',
      'Flyers & Brochures',
      'Posters',
      'Letterheads',
      'Envelopes',
      'Books',
    ],
    badge: 'Fast Turnaround',
    badgeColor: 'bg-[oklch(0.92_0.05_195)] text-[oklch(0.35_0.12_195)] border-[oklch(0.80_0.06_195)]',
    tagline: null,
  },
  {
    id: 'outdoor',
    sampleImage: '/assets/generated/service-outdoor-printing.dim_800x500.png',
    title: 'Outdoor Printing',
    description: 'Large format outdoor prints for maximum visibility at events, shops, and outdoor advertising.',
    items: [
      'Flex Banners',
      'Star Flex',
      'Signboards',
      'Canvas',
    ],
    badge: 'Large Format',
    badgeColor: 'bg-[oklch(0.92_0.06_145)] text-[oklch(0.35_0.14_145)] border-[oklch(0.80_0.08_145)]',
    tagline: null,
  },
  {
    id: 'indoor',
    sampleImage: '/assets/generated/service-indoor-printing.dim_800x500.png',
    title: 'Indoor Printing',
    description: 'Premium quality indoor prints and displays for retail, exhibitions, and interior decoration.',
    items: [
      'Stickers (Die-cut)',
      'Stickers (White/Black/Grey back)',
      'Transparent Stickers',
      'Vinyl Printing',
      'Indoor Banners',
      'Canvas Prints',
      'Posters',
    ],
    badge: 'Premium Quality',
    badgeColor: 'bg-[oklch(0.92_0.04_270)] text-[oklch(0.35_0.12_270)] border-[oklch(0.80_0.06_270)]',
    tagline: null,
  },
  {
    id: 'screen',
    sampleImage: '/assets/generated/service-screen-printing.dim_800x500.png',
    title: 'Screen Printing & Personalization',
    description: 'Custom screen printing and personalization services for promotional items and branded merchandise.',
    items: [
      'Pen Printing',
      'T-Shirt Printing',
      'Balloon Printing',
      'Sublimation Printing',
      'DTF (Direct to Film) Printing',
    ],
    badge: 'Personalized',
    badgeColor: 'bg-[oklch(0.93_0.05_30)] text-[oklch(0.38_0.14_25)] border-[oklch(0.82_0.08_28)]',
    tagline: null,
  },
  {
    id: 'offset',
    sampleImage: '/assets/generated/service-offset-printing.dim_800x500.png',
    title: 'Offset Printing',
    description: 'Cost-effective bulk printing with consistent quality for large volume orders.',
    items: [
      'Magazines',
      'Catalogs',
      'Books',
      'Packaging / Cardboard Boxes',
      'Paper Bags',
    ],
    badge: 'Bulk Orders',
    badgeColor: 'bg-[oklch(0.92_0.04_240)] text-[oklch(0.35_0.12_240)] border-[oklch(0.80_0.06_240)]',
    tagline: 'Cost-effective bulk printing with consistent quality for large volume orders.',
  },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="bg-background min-h-screen">
      {/* Page Header */}
      <div className="bg-[oklch(0.20_0.07_205)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest mb-3">
            <Printer className="w-3.5 h-3.5" />
            Our Services
          </div>
          <h1 className="font-heading text-4xl font-bold text-white mb-3">
            {t('services.title') || 'Printing Services'}
          </h1>
          <p className="text-white/70 max-w-xl">
            {t('services.subtitle') || 'From business cards to large-format banners — professional printing for every need.'}
          </p>
        </div>
      </div>

      {/* Services List */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {serviceData.map((service, idx) => (
            <div
              key={service.id}
              className="bg-card border border-border rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow"
            >
              <div className={`grid grid-cols-1 lg:grid-cols-2 ${idx % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                {/* Image */}
                <div className={`relative overflow-hidden ${idx % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <img
                    src={service.sampleImage}
                    alt={service.title}
                    className="w-full h-56 lg:h-full object-cover"
                    style={{ minHeight: '220px' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <div className="mb-4">
                    <div className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border mb-2 ${service.badgeColor}`}>
                      {service.badge}
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-foreground">
                      {service.title}
                    </h2>
                    {service.tagline && (
                      <p className="text-sm text-[oklch(0.42_0.12_195)] font-medium mt-1 italic">
                        {service.tagline}
                      </p>
                    )}
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-5 text-sm">
                    {service.description}
                  </p>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-6">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle className="w-4 h-4 text-[oklch(0.42_0.12_195)] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigate({ to: '/request-quote' })}
                    className="self-start flex items-center gap-2 px-5 py-2.5 bg-[oklch(0.42_0.12_195)] hover:bg-[oklch(0.68_0.18_72)] text-white font-semibold rounded transition-colors text-sm"
                  >
                    {t('services.getQuote') || 'Get a Quote'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
