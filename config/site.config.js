/**
 * ELAFO HAIR - Official Site Configuration
 * Single source of truth for business metadata, contact channels, and flagged placeholders.
 * US Business: Lanham, MD 20706 | Timezone: America/New_York
 */

export const siteConfig = {
  // Official Brand Info
  brandName: "ELAFO HAIR BRAIDING",
  tagline: "Braids that crown you.",
  subtitle: "Luxury hair braiding in Lanham, Maryland. Clean parts, gentle tension, edge protection.",
  foundedBy: "African woman artisan",
  audience: "US / American textured hair community",
  language: "en-US",
  timezone: "America/New_York",
  currency: "USD",
  units: "inches",

  // Official Studio Location
  location: {
    name: "Elafo Hair Braiding Studio",
    addressLine1: "7404 Executive Place",
    city: "Lanham",
    state: "MD",
    zip: "20706",
    country: "USA",
    region: "Lanham, Bowie & Prince George's County (DMV)",
    fullAddress: "7404 Executive Place, Lanham, MD 20706, USA",
    // TODO Placeholder: Exact Google Maps Link
    googleMapsUrl: "https://maps.google.com/?q=7404+Executive+Place+Lanham+MD+20706",
    // TODO Placeholder: Coordinates
    geo: {
      latitude: 38.9665,
      longitude: -76.8488
    }
  },

  // Official Social Media Channels
  socials: {
    instagram: {
      handle: "@elafobraiding",
      url: "https://www.instagram.com/elafobraiding/"
    },
    tiktok: {
      handle: "@elafo350",
      url: "https://www.tiktok.com/@elafo350"
    },
    facebook: {
      name: "Elafo Hair Braiding",
      url: "https://web.facebook.com/profile.php?id=61593529456530"
    }
  },

  // Contact Channels & Placeholders (FLAGGED TODOs)
  contact: {
    // TODO: Phone number placeholder to be replaced with official line
    phoneDisplay: "(202) 924-0837",
    phoneRaw: "+12029240837",
    
    // TODO: SMS text line
    smsDisplay: "(202) 924-0837",
    smsRaw: "+12029240837",
    
    // TODO: Official contact email
    email: "contact@elafobraiding.com",
    
    // Optional WhatsApp channel (strict instruction: default off, not primary)
    whatsappEnabled: false,
    whatsappRaw: "+12029240837",

    // TODO: Optional external booking URL (e.g. Acuity / Styleseat / Square)
    externalBookingUrl: null,

    // TODO: Google review URL
    googleReviewUrl: "https://g.page/r/elafobraiding/review",

    // TODO: Domain placeholder
    domain: "elafobraiding.com"
  },

  // Studio Operating Hours (America/New_York, 12-hour clock)
  // Day of week: 0 = Sun, 1 = Mon, ..., 6 = Sat
  hours: [
    { day: "Monday", open: "09:00", close: "19:00", display: "9:00 AM – 7:00 PM", dayOfWeek: 1 },
    { day: "Tuesday", open: "09:00", close: "19:00", display: "9:00 AM – 7:00 PM", dayOfWeek: 2 },
    { day: "Wednesday", open: "09:00", close: "19:00", display: "9:00 AM – 7:00 PM", dayOfWeek: 3 },
    { day: "Thursday", open: "09:00", close: "19:00", display: "9:00 AM – 7:00 PM", dayOfWeek: 4 },
    { day: "Friday", open: "08:30", close: "19:30", display: "8:30 AM – 7:30 PM", dayOfWeek: 5 },
    { day: "Saturday", open: "08:00", close: "20:00", display: "8:00 AM – 8:00 PM", dayOfWeek: 6 },
    { day: "Sunday", open: "10:00", close: "18:00", display: "10:00 AM – 6:00 PM", dayOfWeek: 0 }
  ],

  // Deposit & Studio Policies
  policies: {
    // TODO: Deposit amount in USD
    depositAmount: 50,
    depositCurrency: "USD",
    depositTerms: "A non-refundable $50 deposit is required to secure your appointment and is deducted in full from your service total on appointment day.",
    gracePeriodMinutes: 15,
    latePolicy: "Please arrive on time. A 15-minute grace period is provided; beyond 20 minutes without notice, appointments may need to be rescheduled to protect other guests.",
    cancellationNoticeHours: 48,
    kidsPolicy: "Children receiving services are warmly welcomed. For safety and peace of mind, unserviced young children are not permitted in the styling area.",
    paymentMethods: ["Cash", "Zelle", "Apple Pay", "Debit / Credit Cards", "Venmo"]
  },

  // Trust Chips for Hero & Value Props
  trustChips: [
    { title: "Edge Protection", subtitle: "Gentle tension, zero pulling" },
    { title: "Lump-sum Quote", subtitle: "Transparent, no hidden chair fees" },
    { title: "Long-lasting", subtitle: "8 to 10 weeks durability" }
  ],

  // 4 Steps of "The Elafo Experience"
  experienceSteps: [
    {
      step: 1,
      title: "Consultation & Scalp Check",
      description: "We assess your hair density, scalp sensitivity, and hairline health before parting."
    },
    {
      step: 2,
      title: "Organic Pre-stretched & Scalp Protection",
      description: "High-grade featherlight extensions pre-rinsed with soothing botanical treatments."
    },
    {
      step: 3,
      title: "Tensionless Braiding",
      description: "Mathematical geometric parting anchored with gentle ergonomic finger technique."
    },
    {
      step: 4,
      title: "Scalp Mist, Mousse & Warm Towel",
      description: "Invigorating tea tree hydration mist, setting mousse seal, and warm aromatherapy towel wrap."
    }
  ]
};

// Global fallback access
if (typeof window !== "undefined") {
  window.ELAFO_CONFIG = siteConfig;
}

export default siteConfig;

