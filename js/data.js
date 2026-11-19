/**
 * ELAFO HAIR BRAIDING - Global Data Repository
 * File: js/data.js
 * 100% offline & file:// compatible: provides global data objects without requiring fetch().
 * Populated exclusively with authentic video captures and client footage from our Lanham studio.
 */

(function () {
  'use strict';

  // 1. Site Configuration & Contact Info
  window.ELAFO_CONFIG = {
    brandName: "ELAFO HAIR BRAIDING",
    shortName: "Elafo Hair",
    tagline: "The Crown You Deserve. Crafted with Gentle Hands.",
    subtitle: "Lanham's sanctuary for luxury protective hair braiding. Clean parts, zero-tension edge care, and long-lasting elegance.",
    location: {
      name: "Elafo Hair Braiding Studio",
      addressLine1: "7404 Executive Place",
      city: "Lanham",
      state: "MD",
      zip: "20706",
      country: "USA",
      region: "Lanham, Bowie & Prince George's County (DMV)",
      fullAddress: "7404 Executive Place, Lanham, MD 20706, USA",
      googleMapsUrl: "https://maps.google.com/?q=7404+Executive+Place+Lanham+MD+20706",
      geo: { latitude: 38.9665, longitude: -76.8488 }
    },
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
    contact: {
      phoneDisplay: "(202) 924-0837",
      phoneRaw: "+12029240837",
      smsDisplay: "(202) 924-0837",
      smsRaw: "+12029240837",
      email: "contact@elafobraiding.com",
      googleReviewUrl: "https://g.page/r/elafobraiding/review",
      domain: "elafobraiding.com"
    },
    hours: [
      { day: "Monday", open: "09:00", close: "19:00", display: "9:00 AM – 7:00 PM", dayOfWeek: 1 },
      { day: "Tuesday", open: "09:00", close: "19:00", display: "9:00 AM – 7:00 PM", dayOfWeek: 2 },
      { day: "Wednesday", open: "09:00", close: "19:00", display: "9:00 AM – 7:00 PM", dayOfWeek: 3 },
      { day: "Thursday", open: "09:00", close: "19:00", display: "9:00 AM – 7:00 PM", dayOfWeek: 4 },
      { day: "Friday", open: "08:30", close: "19:30", display: "8:30 AM – 7:30 PM", dayOfWeek: 5 },
      { day: "Saturday", open: "08:00", close: "20:00", display: "8:00 AM – 8:00 PM", dayOfWeek: 6 },
      { day: "Sunday", open: "10:00", close: "18:00", display: "10:00 AM – 6:00 PM", dayOfWeek: 0 }
    ],
    policies: {
      depositAmount: 50,
      depositCurrency: "USD",
      depositTerms: "A non-refundable $50 deposit is required to secure your appointment and is deducted in full from your service total on appointment day.",
      gracePeriodMinutes: 15,
      cancellationNoticeHours: 48,
      paymentMethods: ["Cash", "Zelle", "Apple Pay", "Debit / Credit Cards", "Venmo"]
    }
  };

  // 2. Services Menu Data (Real Video Capture Thumbnails)
  window.ELAFO_SERVICES = [
    {
      id: "small-knotless",
      category: "knotless",
      name: "Small Knotless Box Braids",
      price: 280,
      duration: "6h 30m",
      description: "Delicate micro-sized squares with zero tension on your hairline. Weightless flow and scalp comfort.",
      image: "./assets/gallery/gallery-01-480.webp",
      tags: ["Signature", "Edge Safe", "Most Popular"]
    },
    {
      id: "medium-knotless",
      category: "knotless",
      name: "Medium Knotless Box Braids",
      price: 240,
      duration: "4h 30m",
      description: "Our signature versatile standard. Lightweight, fluid movement, and scalp-breathable organic parting.",
      image: "./assets/gallery/gallery-02-480.webp",
      tags: ["Classic", "High Durability"]
    },
    {
      id: "large-knotless",
      category: "knotless",
      name: "Large Knotless Braids",
      price: 180,
      duration: "3h 00m",
      description: "Statement jumbo square parting. Fast installation with soft finish and comfortable weight.",
      image: "./assets/gallery/gallery-03-480.webp",
      tags: ["Quick Install", "Statement"]
    },
    {
      id: "boho-goddess",
      category: "boho",
      name: "Bohemian Goddess Curls",
      price: 300,
      duration: "5h 30m",
      description: "Knotless braids interwoven with lush, touchable bohemian curl tendrils throughout.",
      image: "./assets/gallery/gallery-04-480.webp",
      tags: ["Trending", "Luxury Finish"]
    },
    {
      id: "boho-bob",
      category: "boho",
      name: "Boho Knotless Bob",
      price: 220,
      duration: "4h 00m",
      description: "Neckline-skimming chic silhouette with curled wisps and featherlight weight.",
      image: "./assets/gallery/gallery-05-480.webp",
      tags: ["Summer Favorite", "Lightweight"]
    },
    {
      id: "stitch-cornrows",
      category: "cornrows",
      name: "Precision Stitch Cornrows",
      price: 110,
      duration: "2h 30m",
      description: "Razor-sharp linear or curved geometric stitch lines sculpted close to the scalp with zero headache tension.",
      image: "./assets/gallery/gallery-06-480.webp",
      tags: ["Sharp Parts", "Low Maintenance"]
    },
    {
      id: "island-twists",
      category: "twists",
      name: "Island & Passion Twists",
      price: 200,
      duration: "3h 30m",
      description: "Bouncy, textured two-strand twists that mimic natural organic coil patterns.",
      image: "./assets/gallery/gallery-07-480.webp",
      tags: ["Natural Texture", "Bouncy"]
    },
    {
      id: "butterfly-locs",
      category: "twists",
      name: "Butterfly Soft Locs",
      price: 240,
      duration: "4h 30m",
      description: "Distressed bohemian locs crafted with gentle tension and textured loops.",
      image: "./assets/gallery/gallery-08-480.webp",
      tags: ["Distressed", "Edge Safe"]
    },
    {
      id: "custom-artisan",
      category: "other",
      name: "Custom Artisan Protective Style",
      price: null,
      duration: "Variable",
      description: "Specialty editorial braiding, Fulani combinations, or custom parted designs.",
      image: "./assets/gallery/gallery-09-480.webp",
      tags: ["Bespoke", "Consultation"]
    }
  ];

  // 3. Pricing Rules (Length surcharges & Studio Add-ons)
  window.ELAFO_PRICING_RULES = {
    lengths: [
      { id: "midback", name: "Mid-back (Standard)", surcharge: 0, default: true },
      { id: "waist", name: "Waist Length (+30\")", surcharge: 30 },
      { id: "butt", name: "Butt Length (+38\")", surcharge: 50 },
      { id: "thigh", name: "Thigh Length (+48\")", surcharge: 80 }
    ],
    addons: [
      { id: "wash-prep", name: "Shampoo & Scalp Prep", price: 25, description: "Gentle clarifying wash & botanical steam blowout" },
      { id: "hair-included", name: "Organic Pre-stretched Hair", price: 30, description: "Hypoallergenic, ultra-soft extension bundles" },
      { id: "takedown", name: "Braid Takedown & Detangle", price: 40, description: "Careful removal of prior braids without breakage" },
      { id: "custom-color", name: "Custom Color Mix / Ombre", price: 30, description: "Artisan multi-tone blending (#1B, #27, #30, #350)" }
    ]
  };

  // 4. Video Gallery Data (12 Featured Reels with Real Video Captures)
  window.ELAFO_VIDEOS = [
    {
      id: "reel-01",
      title: "Waistline Knotless Crown",
      category: "knotless",
      duration: "0:24",
      videoUrl: "./assets/video/reel-01.mp4",
      webmUrl: "./assets/video/reel-01.webm",
      posterUrl: "./assets/gallery/gallery-01-480.webp",
      posterJpg: "./assets/gallery/gallery-01.jpg",
      styleName: "Waistline Knotless Box Braids"
    },
    {
      id: "reel-02",
      title: "Auburn Goddess Curls",
      category: "boho",
      duration: "0:42",
      videoUrl: "./assets/video/reel-02.mp4",
      webmUrl: "./assets/video/reel-02.webm",
      posterUrl: "./assets/gallery/gallery-02-480.webp",
      posterJpg: "./assets/gallery/gallery-02.jpg",
      styleName: "Bohemian Goddess Curls"
    },
    {
      id: "reel-03",
      title: "Curved Tribal Stitch Cornrows",
      category: "cornrows",
      duration: "0:15",
      videoUrl: "./assets/video/reel-03.mp4",
      webmUrl: "./assets/video/reel-03.webm",
      posterUrl: "./assets/gallery/gallery-03-480.webp",
      posterJpg: "./assets/gallery/gallery-03.jpg",
      styleName: "Curved Tribal Cornrows"
    },
    {
      id: "reel-04",
      title: "Sleek Linear Stitch Braids",
      category: "cornrows",
      duration: "0:18",
      videoUrl: "./assets/video/reel-04.mp4",
      webmUrl: "./assets/video/reel-04.webm",
      posterUrl: "./assets/gallery/gallery-04-480.webp",
      posterJpg: "./assets/gallery/gallery-04.jpg",
      styleName: "Sleek Linear Cornrows"
    },
    {
      id: "reel-05",
      title: "Plum Berry Curled Bob",
      category: "boho",
      duration: "0:36",
      videoUrl: "./assets/video/reel-05.mp4",
      webmUrl: "./assets/video/reel-05.webm",
      posterUrl: "./assets/gallery/gallery-05-480.webp",
      posterJpg: "./assets/gallery/gallery-05.jpg",
      styleName: "Boho Knotless Bob"
    },
    {
      id: "reel-06",
      title: "Butt-Length Knotless Cascade",
      category: "knotless",
      duration: "0:12",
      videoUrl: "./assets/video/reel-06.mp4",
      webmUrl: "./assets/video/reel-06.webm",
      posterUrl: "./assets/gallery/gallery-06-480.webp",
      posterJpg: "./assets/gallery/gallery-06.jpg",
      styleName: "Long Knotless Box Braids"
    },
    {
      id: "reel-07",
      title: "Geometric Diamond Parting",
      category: "cornrows",
      duration: "0:28",
      videoUrl: "./assets/video/reel-07.mp4",
      webmUrl: "./assets/video/reel-07.webm",
      posterUrl: "./assets/gallery/gallery-07-480.webp",
      posterJpg: "./assets/gallery/gallery-07.jpg",
      styleName: "Geometric Diamond Parting"
    },
    {
      id: "reel-08",
      title: "Warm Honey Ombre Knotless",
      category: "knotless",
      duration: "0:22",
      videoUrl: "./assets/video/reel-08.mp4",
      webmUrl: "./assets/video/reel-08.webm",
      posterUrl: "./assets/gallery/gallery-08-480.webp",
      posterJpg: "./assets/gallery/gallery-08.jpg",
      styleName: "Ombre Knotless Braids"
    },
    {
      id: "reel-09",
      title: "Silken Island Passion Twists",
      category: "twists",
      duration: "0:31",
      videoUrl: "./assets/video/reel-09.mp4",
      webmUrl: "./assets/video/reel-09.webm",
      posterUrl: "./assets/gallery/gallery-09-480.webp",
      posterJpg: "./assets/gallery/gallery-09.jpg",
      styleName: "Island Passion Twists"
    },
    {
      id: "reel-10",
      title: "Edge-Safe Perimeter Braids",
      category: "knotless",
      duration: "0:16",
      videoUrl: "./assets/video/reel-10.mp4",
      webmUrl: "./assets/video/reel-10.webm",
      posterUrl: "./assets/gallery/gallery-10-480.webp",
      posterJpg: "./assets/gallery/gallery-10.jpg",
      styleName: "Edge-Safe Perimeter Braids"
    },
    {
      id: "reel-11",
      title: "Tribal Feed-In Crown",
      category: "cornrows",
      duration: "0:26",
      videoUrl: "./assets/video/reel-11.mp4",
      webmUrl: "./assets/video/reel-11.webm",
      posterUrl: "./assets/gallery/gallery-11-480.webp",
      posterJpg: "./assets/gallery/gallery-11.jpg",
      styleName: "Tribal Feed-In Braids"
    },
    {
      id: "reel-12",
      title: "Surgical Geometric Stitch Parting",
      category: "cornrows",
      duration: "0:20",
      videoUrl: "./assets/video/reel-12.mp4",
      webmUrl: "./assets/video/reel-12.webm",
      posterUrl: "./assets/gallery/gallery-12-480.webp",
      posterJpg: "./assets/gallery/gallery-12.jpg",
      styleName: "Precision Stitch Cornrows"
    }
  ];

  // 5. Master Braiders & Hairstyle Showcase (Real Video Frame Captures)
  window.ELAFO_BRAIDER_SHOWCASE = [
    {
      title: "Curved Tribal Stitch Cornrows",
      category: "Stitch Cornrows",
      technique: "Mathematical linear spacing, edge preservation, and soothing herbal seal",
      image: "./assets/gallery/gallery-03.jpg",
      thumb: "./assets/gallery/gallery-03-480.webp"
    },
    {
      title: "Auburn Goddess Curls & Parting",
      category: "Bohemian Goddess",
      technique: "Rich copper #350 tone, zero-tension crown, and bouncy coiled ends",
      image: "./assets/gallery/gallery-02.jpg",
      thumb: "./assets/gallery/gallery-02-480.webp"
    },
    {
      title: "Full-Length Sleek Stitch Crown",
      category: "Linear Cornrows",
      technique: "Clean geometric perimeter and delicate baby-hair preservation",
      image: "./assets/gallery/gallery-04.jpg",
      thumb: "./assets/gallery/gallery-04-480.webp"
    },
    {
      title: "Plum Berry Curled Bob Braids",
      category: "Boho Short Styles",
      technique: "Modern chic neckline length with bouncy roller-set ends",
      image: "./assets/gallery/gallery-05.jpg",
      thumb: "./assets/gallery/gallery-05-480.webp"
    },
    {
      title: "Surgical Geometric Stitch Parting",
      category: "Surgical Parting",
      technique: "Architectural scalp grid spacing, zero traction pull, and organic tea-tree botanical seal",
      image: "./assets/gallery/gallery-28.jpg",
      thumb: "./assets/gallery/gallery-28-480.webp"
    },
    {
      title: "Fulani Tribal Beaded Ponytail",
      category: "Tribal Artistry",
      technique: "Intricate side-swept curves, natural amber wooden beads, and high crown ponytail",
      image: "./assets/gallery/gallery-07.jpg",
      thumb: "./assets/gallery/gallery-07-480.webp"
    }
  ];

})();
