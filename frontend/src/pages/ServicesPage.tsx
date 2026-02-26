import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetServiceImages } from '../hooks/useServiceImages';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle } from 'lucide-react';

const SERVICES = [
  {
    key: 'digital',
    icon: '/assets/generated/digital-icon.dim_256x256.png',
    sampleImage: '/assets/generated/print-sample-business-card.dim_800x450.png',
    en: 'Digital Printing',
    te: 'డిజిటల్ ప్రింటింగ్',
    descEn: 'High-quality digital prints for all your needs — business cards, flyers, posters, and more.',
    descTe: 'అన్ని అవసరాలకు అధిక నాణ్యత డిజిటల్ ప్రింట్లు — బిజినెస్ కార్డులు, ఫ్లయర్లు, పోస్టర్లు మరియు మరిన్ని.',
    features: [
      { en: 'Business Cards', te: 'బిజినెస్ కార్డులు' },
      { en: 'Flyers & Pamphlets', te: 'ఫ్లయర్లు & పాంఫ్లెట్లు' },
      { en: 'Posters', te: 'పోస్టర్లు' },
      { en: 'ID Cards', te: 'ఐడి కార్డులు' },
    ],
  },
  {
    key: 'banner',
    icon: '/assets/generated/flex-icon.dim_256x256.png',
    sampleImage: '/assets/generated/print-sample-banner.dim_800x450.png',
    en: 'Banner / Flex Printing',
    te: 'బ్యానర్ / ఫ్లెక్స్ ప్రింటింగ్',
    descEn: 'Large format banners and flex boards for events, shops, and outdoor advertising.',
    descTe: 'ఈవెంట్లు, దుకాణాలు మరియు అవుట్‌డోర్ ప్రకటనల కోసం పెద్ద ఫార్మాట్ బ్యానర్లు మరియు ఫ్లెక్స్ బోర్డులు.',
    features: [
      { en: 'Vinyl Banners', te: 'వినైల్ బ్యానర్లు' },
      { en: 'Flex Boards', te: 'ఫ్లెక్స్ బోర్డులు' },
      { en: 'Hoardings', te: 'హోర్డింగ్లు' },
      { en: 'Event Backdrops', te: 'ఈవెంట్ బ్యాక్‌డ్రాప్లు' },
    ],
  },
  {
    key: 'offset',
    icon: '/assets/generated/offset-icon.dim_256x256.png',
    sampleImage: '/assets/generated/print-sample-brochure.dim_800x450.png',
    en: 'Offset Printing',
    te: 'ఆఫ్‌సెట్ ప్రింటింగ్',
    descEn: 'Professional offset printing for bulk orders — brochures, catalogues, books, and stationery.',
    descTe: 'బల్క్ ఆర్డర్ల కోసం ప్రొఫెషనల్ ఆఫ్‌సెట్ ప్రింటింగ్ — బ్రోచర్లు, కేటలాగ్లు, పుస్తకాలు మరియు స్టేషనరీ.',
    features: [
      { en: 'Brochures & Catalogues', te: 'బ్రోచర్లు & కేటలాగ్లు' },
      { en: 'Books & Magazines', te: 'పుస్తకాలు & మ్యాగజైన్లు' },
      { en: 'Letterheads', te: 'లెటర్‌హెడ్లు' },
      { en: 'Bulk Stationery', te: 'బల్క్ స్టేషనరీ' },
    ],
  },
  {
    key: 'design',
    icon: '/assets/generated/design-icon.dim_256x256.png',
    sampleImage: '/assets/generated/print-sample-flex.dim_800x450.png',
    en: 'Design Services',
    te: 'డిజైన్ సేవలు',
    descEn: 'Creative design solutions for your brand — logos, layouts, and complete brand identity packages.',
    descTe: 'మీ బ్రాండ్ కోసం క్రియేటివ్ డిజైన్ పరిష్కారాలు — లోగోలు, లేఔట్లు మరియు పూర్తి బ్రాండ్ ఐడెంటిటీ ప్యాకేజీలు.',
    features: [
      { en: 'Logo Design', te: 'లోగో డిజైన్' },
      { en: 'Brand Identity', te: 'బ్రాండ్ ఐడెంటిటీ' },
      { en: 'Print Layouts', te: 'ప్రింట్ లేఔట్లు' },
      { en: 'Social Media Graphics', te: 'సోషల్ మీడియా గ్రాఫిక్స్' },
    ],
  },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  const { data: serviceImages } = useGetServiceImages();

  const getServiceImage = (key: string, fallback: string) => {
    if (serviceImages && serviceImages.length > 0) {
      const match = serviceImages.find((img) => img.serviceType.toLowerCase() === key);
      if (match) return match.imageUrl;
    }
    return fallback;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-background py-10 px-4 text-center">
        <h1 className="text-3xl font-extrabold text-foreground mb-1">Our Services</h1>
        <p className="text-xl text-primary font-semibold mb-2">మా సేవలు</p>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Complete printing & design solutions for every need.
          <span className="block">ప్రతి అవసరానికి పూర్తి ప్రింటింగ్ & డిజైన్ పరిష్కారాలు.</span>
        </p>
      </section>

      {/* Service Cards */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {SERVICES.map((service) => {
            const imageUrl = getServiceImage(service.key, service.sampleImage);
            return (
              <Card key={service.key} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-2/5 relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={service.en}
                      className="w-full h-48 md:h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = service.sampleImage;
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <img src={service.icon} alt="" className="w-10 h-10 rounded-lg shadow-md bg-white/80 p-1" />
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="md:w-3/5 p-5">
                    <div className="mb-3">
                      <h2 className="text-xl font-bold text-foreground">{service.en}</h2>
                      <p className="text-primary font-semibold">{service.te}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{service.descEn}</p>
                    <p className="text-xs text-muted-foreground/80 mb-4">{service.descTe}</p>

                    <div className="grid grid-cols-2 gap-1.5 mb-4">
                      {service.features.map((f) => (
                        <div key={f.en} className="flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                          <div>
                            <span className="text-xs font-medium text-foreground">{f.en}</span>
                            <span className="block text-xs text-muted-foreground">{f.te}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => navigate({ to: '/request-quote' })}
                      className="gap-1.5"
                    >
                      Get Quote / కోటేషన్ పొందండి
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
