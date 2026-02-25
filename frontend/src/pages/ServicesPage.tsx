import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from '@tanstack/react-router';
import {
  Palette,
  Printer,
  Megaphone,
  Layers,
  Shirt,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

const serviceCategories = [
  {
    id: 'design',
    icon: Palette,
    color: 'text-violet-500',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
    borderColor: 'border-violet-200 dark:border-violet-800',
    label: 'Design Services',
    labelTe: 'డిజైన్ సేవలు',
    description: 'Creative design solutions for your brand',
    descriptionTe: 'మీ బ్రాండ్ కోసం క్రియేటివ్ డిజైన్ పరిష్కారాలు',
    items: [
      { en: 'Logo Design', te: 'లోగో డిజైన్' },
      { en: 'Brand Identity', te: 'బ్రాండ్ గుర్తింపు' },
      { en: 'Marketing Materials', te: 'మార్కెటింగ్ మెటీరియల్స్' },
      { en: 'Social Media Graphics', te: 'సోషల్ మీడియా గ్రాఫిక్స్' },
      { en: 'Packaging Design', te: 'ప్యాకేజింగ్ డిజైన్' },
      { en: 'Photo Editing', te: 'ఫోటో ఎడిటింగ్' },
    ],
  },
  {
    id: 'digital',
    icon: Printer,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    label: 'Digital Printing',
    labelTe: 'డిజిటల్ ప్రింటింగ్',
    description: 'High-quality digital prints for all needs',
    descriptionTe: 'అన్ని అవసరాలకు అధిక నాణ్యత డిజిటల్ ప్రింట్లు',
    items: [
      { en: 'Business Cards', te: 'బిజినెస్ కార్డులు' },
      { en: 'Flyers & Brochures', te: 'ఫ్లయర్లు & బ్రోచర్లు' },
      { en: 'Posters', te: 'పోస్టర్లు' },
      { en: 'Letterheads', te: 'లెటర్‌హెడ్లు' },
      { en: 'Envelopes', te: 'ఎన్వలప్లు' },
      { en: 'Books', te: 'పుస్తకాలు' },
    ],
  },
  {
    id: 'outdoor',
    icon: Megaphone,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    borderColor: 'border-orange-200 dark:border-orange-800',
    label: 'Outdoor Printing',
    labelTe: 'అవుట్‌డోర్ ప్రింటింగ్',
    description: 'Bold outdoor displays that get noticed',
    descriptionTe: 'దృష్టిని ఆకర్షించే అవుట్‌డోర్ డిస్‌ప్లేలు',
    items: [
      { en: 'Flex Banners', te: 'ఫ్లెక్స్ బ్యానర్లు' },
      { en: 'Star Flex', te: 'స్టార్ ఫ్లెక్స్' },
      { en: 'Signboards', te: 'సైన్‌బోర్డులు' },
      { en: 'Canvas', te: 'కాన్వాస్' },
    ],
  },
  {
    id: 'indoor',
    icon: Layers,
    color: 'text-teal-500',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
    borderColor: 'border-teal-200 dark:border-teal-800',
    label: 'Indoor Printing',
    labelTe: 'ఇండోర్ ప్రింటింగ్',
    description: 'Premium indoor prints and displays',
    descriptionTe: 'ప్రీమియం ఇండోర్ ప్రింట్లు మరియు డిస్‌ప్లేలు',
    items: [
      { en: 'Stickers (Die-cut)', te: 'స్టిక్కర్లు (డై-కట్)' },
      { en: 'Stickers (White/Black/Grey back)', te: 'స్టిక్కర్లు (తెలుపు/నలుపు/బూడిద వెనుక)' },
      { en: 'Transparent Stickers', te: 'పారదర్శక స్టిక్కర్లు' },
      { en: 'Vinyl Printing', te: 'వినైల్ ప్రింటింగ్' },
      { en: 'Indoor Banners', te: 'ఇండోర్ బ్యానర్లు' },
      { en: 'Canvas Prints', te: 'కాన్వాస్ ప్రింట్లు' },
      { en: 'Posters', te: 'పోస్టర్లు' },
    ],
  },
  {
    id: 'screen',
    icon: Shirt,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-950/30',
    borderColor: 'border-pink-200 dark:border-pink-800',
    label: 'Screen Printing & Personalization',
    labelTe: 'స్క్రీన్ ప్రింటింగ్ & వ్యక్తిగతీకరణ',
    description: 'Custom prints on apparel and promotional items',
    descriptionTe: 'దుస్తులు మరియు ప్రమోషనల్ వస్తువులపై కస్టమ్ ప్రింట్లు',
    items: [
      { en: 'Pen Printing', te: 'పెన్ ప్రింటింగ్' },
      { en: 'T-Shirt Printing', te: 'టీ-షర్ట్ ప్రింటింగ్' },
      { en: 'Balloon Printing', te: 'బెలూన్ ప్రింటింగ్' },
      { en: 'Sublimation Printing', te: 'సబ్లిమేషన్ ప్రింటింగ్' },
      { en: 'DTF (Direct to Film) Printing', te: 'డీటీఎఫ్ (డైరెక్ట్ టు ఫిల్మ్) ప్రింటింగ్' },
    ],
  },
  {
    id: 'offset',
    icon: BookOpen,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    label: 'Offset Printing',
    labelTe: 'ఆఫ్‌సెట్ ప్రింటింగ్',
    description: 'Cost-effective bulk printing with consistent quality for large volume orders.',
    descriptionTe: 'పెద్ద వాల్యూమ్ ఆర్డర్లకు స్థిరమైన నాణ్యతతో తక్కువ ఖర్చుతో బల్క్ ప్రింటింగ్.',
    items: [
      { en: 'Magazines', te: 'మ్యాగజైన్లు' },
      { en: 'Catalogs', te: 'కేటలాగ్లు' },
      { en: 'Books', te: 'పుస్తకాలు' },
      { en: 'Packaging / Cardboard Boxes', te: 'ప్యాకేజింగ్ / కార్డ్‌బోర్డ్ బాక్సులు' },
      { en: 'Paper Bags', te: 'పేపర్ బ్యాగులు' },
    ],
  },
];

export default function ServicesPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 pt-8 pb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
          <Sparkles className="w-4 h-4" />
          {language === 'te' ? 'మా సేవలు' : 'Our Services'}
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {language === 'te' ? 'సంపూర్ణ ప్రింటింగ్ పరిష్కారాలు' : 'Complete Printing Solutions'}
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          {language === 'te'
            ? 'డిజైన్ నుండి డెలివరీ వరకు అన్ని ప్రింటింగ్ అవసరాలు'
            : 'From design to delivery — all your printing needs under one roof'}
        </p>
      </div>

      {/* Service Categories */}
      <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto">
        {serviceCategories.map((cat, index) => {
          const Icon = cat.icon;
          const isExpanded = expandedId === cat.id;
          const label = language === 'te' ? cat.labelTe : cat.label;
          const description = language === 'te' ? cat.descriptionTe : cat.description;

          return (
            <div
              key={cat.id}
              className={`rounded-2xl border ${cat.borderColor} ${cat.bgColor} overflow-hidden transition-all duration-200`}
            >
              <button
                onClick={() => toggle(cat.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-background/60 ${cat.color} flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <h3 className="font-semibold text-foreground text-sm leading-tight">{label}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{description}</p>
                </div>
                <div className={`flex-shrink-0 ${cat.color}`}>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="border-t border-current/10 pt-3">
                    {cat.id === 'offset' && (
                      <p className="text-xs text-muted-foreground mb-3 italic">{description}</p>
                    )}
                    <ul className="grid grid-cols-2 gap-1.5">
                      {cat.items.map((item) => (
                        <li
                          key={item.en}
                          className="flex items-center gap-1.5 text-xs text-foreground/80"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cat.color.replace('text-', 'bg-')}`} />
                          {language === 'te' ? item.te : item.en}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="px-4 py-4 max-w-2xl mx-auto">
        <div className="bg-primary rounded-2xl p-5 text-center text-primary-foreground">
          <h3 className="font-bold text-lg mb-1">
            {language === 'te' ? 'కోట్ పొందండి' : 'Get a Quote'}
          </h3>
          <p className="text-sm opacity-80 mb-4">
            {language === 'te'
              ? 'మీ ప్రాజెక్ట్ కోసం ఉచిత అంచనా పొందండి'
              : 'Get a free estimate for your project today'}
          </p>
          <button
            onClick={() => navigate({ to: '/request-quote' })}
            className="bg-primary-foreground text-primary font-semibold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            {language === 'te' ? 'ఇప్పుడే అభ్యర్థించండి' : 'Request Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
