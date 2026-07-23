export type Service = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  startingAt: string;
};

export const services: Service[] = [
  {
    slug: "web-design",
    name: "Website Design & Development",
    tagline: "Fast, modern sites that turn visitors into clients",
    description:
      "Custom-built websites on modern, high-performance frameworks — not a bloated drag-and-drop template. Every site is designed around your services and built to load fast, rank on Google, and convert visitors into leads.",
    features: [
      "Custom design, not a recycled template",
      "Mobile-first, fast-loading pages",
      "Built-in SEO fundamentals",
      "Lead capture forms & analytics wired in",
      "Content updates you can make yourself",
    ],
    startingAt: "$1,500",
  },
  {
    slug: "branding",
    name: "Logo & Brand Identity",
    tagline: "A brand that looks like it belongs in your industry's top tier",
    description:
      "Logo, color system, typography, and brand guidelines designed together — so your website, business cards, and social presence all look like one company, not five different ones stitched together.",
    features: [
      "Custom logo with usable file formats (SVG, PNG, PDF)",
      "Color palette & typography system",
      "Brand guideline one-pager",
      "Social media & profile-ready assets",
    ],
    startingAt: "$600",
  },
  {
    slug: "ai-chatbots",
    name: "AI Chatbots & Virtual Assistants",
    tagline: "Answer every lead, day or night",
    description:
      "A trained AI chatbot embedded on your site that answers common questions, qualifies leads, and books appointments automatically — so you stop losing business to slow response times.",
    features: [
      "Trained on your business's own information",
      "Lead qualification & appointment booking",
      "Live handoff to a human when needed",
      "Works on your website, and optionally SMS or Facebook/Instagram",
    ],
    startingAt: "$900",
  },
  {
    slug: "ai-business-solutions",
    name: "AI Business Solutions",
    tagline: "Put AI to work inside your business, not just on your website",
    description:
      "Beyond the website — we help you automate the busywork: intake forms that write themselves up, AI-assisted quoting, internal knowledge assistants, and workflow automation tailored to how your business actually runs.",
    features: [
      "Workflow & process automation audits",
      "Custom AI tools for quoting, scheduling, or reporting",
      "Internal knowledge-base assistants",
      "Ongoing strategy as AI tools evolve",
    ],
    startingAt: "Custom quote",
  },
];

export type PricingTier = {
  name: string;
  price: string;
  cadence?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export const websiteTiers: PricingTier[] = [
  {
    name: "Launch",
    price: "$1,500",
    description: "A polished single-purpose site to get a new or growing business online fast.",
    features: [
      "Up to 5 custom pages",
      "Mobile-first responsive design",
      "Contact & lead capture forms",
      "Basic on-page SEO setup",
      "2 rounds of revisions",
    ],
  },
  {
    name: "Growth",
    price: "$3,200",
    description: "Our most popular package — built for local businesses ready to compete online.",
    features: [
      "Up to 12 custom pages",
      "AI chatbot add-on discount included",
      "Blog / content section",
      "Advanced SEO & analytics setup",
      "Booking or quote-request integration",
      "3 rounds of revisions",
    ],
    highlighted: true,
  },
  {
    name: "Scale",
    price: "Custom quote",
    description: "For multi-location businesses or companies ready to expand nationwide.",
    features: [
      "Unlimited pages & custom features",
      "E-commerce or client portal options",
      "Full brand identity included",
      "Priority support & ongoing optimization",
      "Dedicated project lead",
    ],
  },
];

export const addOns = [
  { name: "Logo & Brand Identity", price: "from $600" },
  { name: "AI Chatbot Integration", price: "from $900" },
  { name: "Monthly Care Plan (updates, hosting, support)", price: "from $99/mo" },
  { name: "AI Business Automation Consulting", price: "custom quote" },
];

export const differentiators = [
  {
    title: "Built AI-first",
    description:
      "We don't bolt AI on as an afterthought — chatbots and automation are part of the core build, not a separate vendor you have to coordinate.",
  },
  {
    title: "Transparent pricing",
    description:
      "Real starting prices, published up front. No \"contact us for a quote\" games before you even know if we're in your budget.",
  },
  {
    title: "One team, one vision",
    description:
      "Your website, brand, and AI tools are designed together so they look and work like they came from the same company — because they did.",
  },
  {
    title: "Local roots, national reach",
    description:
      "Founded in Orlando and built to serve local businesses first — with the infrastructure to take on clients nationwide as we grow.",
  },
];

export const process = [
  { step: "01", title: "Discover", description: "A short consultation to understand your business, goals, and competitors." },
  { step: "02", title: "Design", description: "Custom design concepts for your site and brand, built around what makes you different." },
  { step: "03", title: "Build", description: "Development of your site, brand assets, and any AI tools, with regular check-ins." },
  { step: "04", title: "Launch", description: "Final testing, launch, and training so you're confident running your new site." },
  { step: "05", title: "Grow", description: "Ongoing support, optimization, and new AI capabilities as your business grows." },
];
