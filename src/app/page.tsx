"use client"

import type { CSSProperties, FormEvent } from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { tokens } from "@/lib/design-system/tokens"
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Square } from "lucide-react"

export const dynamic = "force-dynamic"

type AccentKey = "atlvs" | "compvss" | "gvteway"
type PersonaFilter = "all" | "production" | "operations" | "experience"

// Accent palette follows column order: Production (compvss) = red, Operations (atlvs) = yellow, Experience (gvteway) = blue
const accents: Record<AccentKey, string> = {
  compvss: "#e53935",
  atlvs: "#ffc107",
  gvteway: "#1e88e5"
}

const scrollToSection = (id: string) => {
  const el = typeof document !== "undefined" ? document.getElementById(id) : null
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

function ContactSubscribeSection() {
  const handleContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <section id="contact" className="mt-16 grid gap-6 rounded-[24px] border border-neutral-300 bg-white p-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)] md:grid-cols-2">
      <div className="space-y-3">
        <SectionHeader kicker="Contact" title="Let's Talk Live Entertainment" description="Our team responds within 24 hours—usually much faster." />
        <form onSubmit={handleContact} className="space-y-3">
          <input
            required
            name="name"
            placeholder="Name"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
          />
          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
          />
          <textarea
            required
            name="message"
            placeholder="How can we help?"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
            rows={4}
          />
          <Button type="submit" className="rounded-full bg-black px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
            Send Message
          </Button>
        </form>
      </div>
      <div className="space-y-3">
        <SectionHeader kicker="Subscribe" title="Stay Ahead of the Industry" description="Platform updates, industry insights, and early access to new features." />
        <form onSubmit={handleSubscribe} className="space-y-3">
          <input
            required
            type="email"
            name="subscribeEmail"
            placeholder="Email"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
          />
          <Button
            type="submit"
            className="rounded-full border border-neutral-300 bg-[#f5f5f5] px-5 text-sm font-semibold text-neutral-900 shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  )
}

const heroStats = [
  { label: "Years Powering Live Events", value: "13+" },
  { label: "Attendees Per Event", value: "400K+" },
  { label: "Production Budgets Managed", value: "$10M+" }
]

const ecosystemCards: {
  id: AccentKey
  title: string
  desc: string
  icon: string
  persona: PersonaFilter
  industry: string
  status: string
  workflow: string[]
  planning: string
  execution: string
  governance: string
  ctaPrimary: string
  ctaSecondary: string
}[] = [
  {
    id: "compvss",
    title: "ATLVS",
    desc: "Manage every production element from crew scheduling to show day execution with real-time visibility, clear ownership, and automated timeline tracking.",
    icon: "Production",
    persona: "production",
    industry: "Media/Live",
    status: "Most Used",
    workflow: ["Build schedule", "Assign crews", "Track show-day checklists"],
    planning: "Production timelines, crew staffing, and vendor coordination unified in a single dashboard",
    execution: "Automated crew calls, logistics coordination, and approval workflows synchronized with your run of show",
    governance: "Role-based permissions for every department and vendor with complete audit trails",
    ctaPrimary: "View Workflows",
    ctaSecondary: "See Pricing Fit"
  },
  {
    id: "atlvs",
    title: "COMPVSS",
    desc: "Centralize business operations, team management, and compliance tracking in one command center with enterprise-grade audit controls.",
    icon: "Operations",
    persona: "operations",
    industry: "Enterprise",
    status: "Live",
    workflow: ["Access policies", "Staff provisioning", "Performance review packets"],
    planning: "Flexible role hierarchies and access policies spanning internal teams and external partners",
    execution: "Intelligent request routing, task assignment, and communications with built-in approval guardrails",
    governance: "Real-time compliance dashboards, approval histories, and audit-ready documentation",
    ctaPrimary: "View Workflows",
    ctaSecondary: "See Pricing Fit"
  },
  {
    id: "gvteway",
    title: "GVTEWAY",
    desc: "Deploy white-labeled audience portals, loyalty programs, and fan experiences with enterprise governance and engagement analytics.",
    icon: "Experience",
    persona: "experience",
    industry: "Audience",
    status: "Featured",
    workflow: ["Create portal", "Publish drops", "Measure engagement"],
    planning: "Fan engagement programs, exclusive drops, and loyalty rewards mapped to attendee journeys",
    execution: "Content publishing, access controls, and engagement triggers managed from a single workflow",
    governance: "Brand safety controls, granular permissions, and complete audit trails across all touchpoints",
    ctaPrimary: "View Workflows",
    ctaSecondary: "See Pricing Fit"
  }
]

const productTestimonials = [
  { quote: "We cut show-day overruns by 50% while keeping every department aligned and on budget.", name: "Capt. Rowan Calder", title: "Master of Production" },
  { quote: "Policies, staffing, and audits stay synchronized in real-time—my department leads get instant clarity without chasing updates.", name: "Capt. Liora Marlowe", title: "Harbormaster of Operations" },
  { quote: "We launch audience engagement programs with brand safety built-in—and measure ROI without additional analytics tools.", name: "Capt. Arjun Tidewell", title: "Commodore of Experience" }
]

const solutions = [
  { title: "Live Productions", desc: "Complete show management from concept and pre-production through execution and wrap", accent: accents.atlvs },
  { title: "Immersive Installations", desc: "Large-scale environment builds, scenic construction, and technical system deployments", accent: accents.compvss },
  { title: "Brand Activations", desc: "Experiential marketing campaigns and branded experiences that drive measurable engagement", accent: accents.gvteway },
  { title: "Entertainment Destinations", desc: "Multi-venue operations, hospitality integration, and location-based experience management", accent: accents.atlvs },
  { title: "Attractions & Exhibits", desc: "Theme parks, museums, permanent installations, and touring exhibition management", accent: accents.gvteway }
]

const features = [
  {
    title: "End-to-End Live Operations Platform",
    desc: "Unified production tooling from initial intake through event wrap with enterprise-grade access governance."
  },
  {
    title: "Single Source of Truth Architecture",
    desc: "One consolidated data model connecting all teams, vendors, venues, and stakeholders in real-time."
  },
  {
    title: "Enterprise-Grade Permissions & Governance",
    desc: "Granular role-based access, comprehensive audits, and approval workflows built for high-stakes live events."
  },
  {
    title: "Unlimited Users, Total Access Control",
    desc: "Scale your production team and vendor network without compromising security or visibility controls."
  },
  {
    title: "Purpose-Built Entertainment Workflows",
    desc: "Run-of-show timelines, logistics coordination, and field operations workflows designed by industry operators."
  },
  {
    title: "Native Integrations + Open API",
    desc: "Seamless calendar, storage, and communication integrations plus full API access for custom development."
  },
  {
    title: "Advanced Dashboards & Real-Time Reporting",
    desc: "Comprehensive operational analytics spanning projects, crew performance, and audience engagement."
  },
  {
    title: "AI-Powered Automation & Intelligent Insights",
    desc: "Smart scheduling suggestions, staffing optimization, and logistics recommendations with human oversight guardrails."
  },
  {
    title: "Multi-Organization Collaboration Hub",
    desc: "Production companies, vendors, agencies, venues, and brands working together in one secure workspace."
  },
  {
    title: "Offline-First Mobile Operations",
    desc: "Full functionality even when venue connectivity fails—automatic sync when you're back online."
  },
  {
    title: "White-Labeled Public Portals",
    desc: "Deploy branded audience-facing experiences and live event dashboards through GVTEWAY."
  },
  {
    title: "Complete White-Label Customization",
    desc: "Your brand identity across every touchpoint—custom logos, colors, domains, and branded authentication flows."
  },
  {
    title: "Real-Time Operational Intelligence",
    desc: "Transform on-site signals and sensor data into actionable operational decisions."
  },
  {
    title: "Built by Operators, for Operators",
    desc: "Every feature developed from field-tested playbooks and real production experience."
  }
]

const pricingPlans = [
  {
    id: "core",
    name: "Core",
    price: "$0",
    cadence: "Free Forever",
    tagline: "Work Here",
    audience: ["Crew", "Artists", "Vendors", "Interns", "Guests", "Volunteers"],
    includes: ["Full workforce and collaborator access layer", "Read access plus scoped task completion"],
    limits: ["Cannot create projects", "Cannot manage users", "No integrations", "No automation", "No AI"],
    cta: "Get Started Free",
    accent: accents.atlvs
  },
  {
    id: "pro",
    name: "Pro",
    price: "$79",
    cadence: "Per User / Month",
    tagline: "Lead Here",
    audience: ["Production managers", "Artist managers", "Department leads", "Vendors running sub-teams", "Embedded freelancers"],
    includes: [
      "Complete write access within your assigned project scopes",
      "Direct management of Core users within your scope",
      "Essential integrations including calendar and cloud storage",
      "AI Agent access with monthly usage allocation",
      "Advanced analytics and reporting for your assigned scopes"
    ],
    limits: ["Cannot create projects", "Cannot change global settings", "No billing/domain/API", "AI + automation caps"],
    cta: "Start Pro Trial",
    accent: accents.compvss
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$1,499",
    cadence: "Starting Monthly",
    tagline: "Create Here",
    audience: ["Production companies", "Festivals", "Venues", "Brands", "Agencies", "Promoters", "Municipalities"],
    includes: [
      "Exclusive project creation and ownership rights",
      "Unlimited domain-verified internal team members",
      "Unlimited external Core and Pro collaborator invites",
      "Complete integrations suite with premium connectors",
      "Unlimited AI Agent access and automation",
      "Full OpenAPI access for custom development",
      "Complete white-label branding and custom domains",
      "GVTEWAY audience-facing portal suite",
      "Enterprise-grade permissions, data governance, and compliance",
      "Up to 10 concurrent active projects",
      "Custom workflow automations",
      "Priority support with dedicated success manager"
    ],
    limits: ["Up to 10 active projects", "AI agent allowance", "Automation runs", "API rate limits", "Priority support"],
    cta: "Contact Sales",
    accent: accents.gvteway
  }
]

const addOns = [
  { name: "White Glove Implementation", price: "$1,000", note: "Includes white-label setup" },
  { name: "Additional Active Projects", price: "$250 / project" },
  { name: "AI Agent Boost Packs", price: "$100–$500" },
  { name: "Automation Packs", price: "$200" },
  { name: "Extra API Throughput", price: "Custom" },
  { name: "Additional White-Label Environment", price: "$500" },
  { name: "Compliance / Audit Mode", price: "$300" },
  { name: "Custom Domain SSL", price: "Included (with white-label)" }
]

const trustLogos = ["Formula 1", "Insomniac", "PATRÓN", "Red Bull", "Heineken", "Carnival Cruise Line", "Live Nation"]
const trustStats: string[] = []

const navLinks = [
  { label: "Products", href: "#products" },
  { label: "Solutions", href: "#solutions" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" }
]

const ecosystemNav = [
  { id: "atlvs" as AccentKey, name: "ATLVS", desc: "Internal operations hub", color: accents.atlvs },
  { id: "compvss" as AccentKey, name: "COMPVSS", desc: "Production management", color: accents.compvss },
  { id: "gvteway" as AccentKey, name: "GVTEWAY", desc: "Consumer experiences", color: accents.gvteway }
]

const faqs = [
  {
    q: "What's the difference between ATLVS, COMPVSS, and GVTEWAY?",
    a: "ATLVS serves as your internal business operations command center, COMPVSS manages all production and show-day workflows, and GVTEWAY powers your public-facing audience experiences and branded portals."
  },
  {
    q: "Can I start with Core and upgrade later?",
    a: "Absolutely. Core users can upgrade to Pro or be invited into Enterprise projects at any time—your data and history transfer seamlessly."
  },
  {
    q: "How does the AI Agent work?",
    a: "The AI Agent analyzes your production data to provide intelligent automation suggestions, operational insights, and workflow optimizations—always with human-in-the-loop approval for critical decisions."
  },
  {
    q: "Is there a mobile app?",
    a: "Yes, native iOS and Android apps with full offline functionality—your crew stays productive even when venue WiFi fails, with automatic sync when connectivity returns."
  },
  {
    q: "What integrations are available?",
    a: "Native integrations with Google Calendar, Microsoft 365, Slack, Dropbox, Google Drive, and major cloud storage providers. Enterprise plans include OpenAPI access for building custom integrations with your existing tech stack."
  },
  {
    q: "How does white-labeling work?",
    a: "Enterprise customers get complete brand customization—your logo, colors, and custom domain across authentication screens, dashboards, team portals, and audience-facing experiences. Your clients never see the ATLVS brand."
  }
]

export default function Home() {
  const openCalendly = () => {
    window.open("https://calendly.com/ghxstship/sync", "_blank", "noopener,noreferrer")
  }

  const goToProducts = () => {
    scrollToSection("products")
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a]" style={{ fontFamily: "Share Tech, sans-serif" }}>
      <NavBar openCalendly={openCalendly} />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <HeroSection onRequestDemo={openCalendly} onExplore={goToProducts} />
        <ProductsSection />
        <SolutionsSection />
        <FeaturesSection />
        <PricingSection onRequestDemo={openCalendly} />
        <SocialProofSection />
        <FAQSection />
        <ContactSubscribeSection />
        <CTASection onRequestDemo={openCalendly} onGetStarted={goToProducts} />
      </main>

      <FooterSection />
    </div>
  )
}

function NavBar({ openCalendly }: { openCalendly: () => void }) {
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()

  const handleSignIn = () => {
    router.push("/auth/login")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-300 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center" style={{ fontFamily: "Anton, var(--font-sans)" }}>
          <span
            className="text-lg"
            style={{
              backgroundImage: tokens.colors.gradients.primary,
              WebkitBackgroundClip: "text",
              color: "transparent"
            }}
          >
            ATLVS
          </span>
        </div>
        <nav className="hidden flex-1 items-center justify-center gap-3 text-sm text-neutral-800 md:flex" style={{ fontFamily: "Share Tech, sans-serif" }}>
          {navLinks.map(link => (
            <a key={link.label} href={link.href} className="rounded-full px-3 py-2 transition hover:bg-neutral-100">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Button className="h-10 rounded-full bg-black px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)]" onClick={openCalendly}>
            Request Demo
          </Button>
          <Button
            className="h-10 rounded-full border border-neutral-300 bg-[#f5f5f5] px-5 text-sm font-semibold text-neutral-900 shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5"
            onClick={handleSignIn}
          >
            Sign in
          </Button>
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setShowMenu(prev => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-lg"
            >
              ≡
            </button>
          </div>
        </div>
      </div>
      {showMenu ? (
        <div className="border-t border-neutral-300 bg-white/95 px-4 pb-4 pt-3 shadow-lg md:hidden" style={{ fontFamily: "Share Tech, sans-serif" }}>
          <div className="flex flex-col gap-3">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900">
                {link.label}
              </a>
            ))}
            <div className="rounded-lg border border-neutral-200 bg-[#f5f5f5] p-3" style={{ fontFamily: "Share Tech Mono, monospace" }}>
              <p className="text-xs uppercase tracking-[0.14em] text-neutral-700">Products</p>
              <div className="mt-2 space-y-1 text-sm text-neutral-900">
                {ecosystemNav.map(item => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                size="lg"
                className="h-11 w-full rounded-full bg-black px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] focus:outline-none"
                onClick={openCalendly}
              >
                Request Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 w-full rounded-full border border-neutral-300 bg-[#f5f5f5] px-6 text-sm font-semibold text-neutral-900 shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 focus:outline-none"
                onClick={handleSignIn}
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

function SectionHeader({ kicker, title, description }: { kicker: string; title: string; description?: string }) {
  return (
    <header className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-neutral-700" style={{ fontFamily: "Share Tech Mono, monospace" }}>
        <Square className="h-3 w-3 fill-neutral-900 text-neutral-900" />
        {kicker}
      </div>
      <h2 className="text-4xl sm:text-5xl capitalize" style={{ fontFamily: "Anton, var(--font-sans)" }}>
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm text-[#4a4a4a]" style={{ fontFamily: "Share Tech, sans-serif" }}>
          {description}
        </p>
      ) : null}
    </header>
  )
}

function HeroSection({ onRequestDemo, onExplore }: { onRequestDemo: () => void; onExplore: () => void }) {
  return (
    <section id="hero" className="relative rounded-[28px] border border-neutral-300 bg-white px-6 py-14 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-xs uppercase tracking-[0.18em] text-neutral-800" style={{ fontFamily: "Share Tech Mono, monospace" }}>
            <Sparkles className="h-4 w-4" />
            The #1 Live Entertainment Operations Platform
          </div>
          <h1 className="text-5xl leading-tight sm:text-6xl lg:text-7xl capitalize" style={{ fontFamily: "Anton, var(--font-sans)" }}>
            Orchestrate. Communicate. Dominate.
          </h1>
          <p className="text-base text-[#4a4a4a] sm:text-lg" style={{ fontFamily: "Share Tech, sans-serif" }}>
            The complete event production management platform trusted by production companies, festivals, and experiential agencies to deliver flawless live experiences—from 50-person theater productions to 400,000+ attendee festivals and $10M+ budgets.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="h-11 rounded-full bg-black px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5"
              onClick={onRequestDemo}
            >
              Request Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-11 rounded-full border border-neutral-300 bg-[#f5f5f5] px-6 text-sm font-semibold text-neutral-900 shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5" onClick={onExplore}>
              Explore Platform
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {heroStats.map(stat => (
              <div key={stat.label} className="rounded-xl border border-neutral-200 bg-[#f5f5f5] px-4 py-3 text-center shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
                <p className="text-2xl font-semibold" style={{ fontFamily: "Anton, var(--font-sans)" }}>
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-[0.14em] text-[#4a4a4a]" style={{ fontFamily: "Share Tech Mono, monospace" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-[22px] border border-neutral-300 bg-[#f5f5f5] shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 text-xs uppercase tracking-[0.16em] text-neutral-700" style={{ fontFamily: "Share Tech Mono, monospace" }}>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-neutral-600">Demo</span>
                <span className="text-neutral-400">/</span>
                <span className="text-neutral-700">ATLVS</span>
                <span className="text-neutral-400">/</span>
                <span className="text-neutral-900">Dashboard</span>
              </div>
              <span
                className="inline-flex items-center gap-1 rounded-full bg-[#eaf6d9] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[--accent-atlvs] shadow-[0_4px_10px_rgba(0,0,0,0.06)]"
                style={{ "--accent-atlvs": accents.atlvs } as CSSProperties}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: accents.atlvs }} />
                Online
              </span>
            </div>
            <div className="space-y-4 p-4">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Active shows", value: "18", tone: accents.compvss },
                  { label: "Crew on shift", value: "342", tone: accents.gvteway },
                  { label: "SLA health", value: "99.2%", tone: accents.atlvs }
                ].map(metric => (
                  <div
                    key={metric.label}
                    className="flex min-h-[118px] flex-col items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 text-center shadow-[0_6px_18px_rgba(0,0,0,0.12)]"
                  >
                    <p
                      className="text-[11px] uppercase tracking-[0.18em] text-neutral-600"
                      style={{ fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.18em" }}
                    >
                      {metric.label}
                    </p>
                    <p
                      className="text-[26px] font-semibold leading-[1.1]"
                      style={{ color: metric.tone, fontFamily: "Anton, var(--font-sans)" }}
                    >
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-neutral-600" style={{ fontFamily: "Share Tech Mono, monospace" }}>
                  <span>Field activations timeline</span>
                  <span>GovAccess</span>
                </div>
                <div className="mt-4 space-y-2">
                  {[
                    { phase: "Load-in", status: "Complete", tone: accents.atlvs },
                    { phase: "Soundcheck", status: "Complete", tone: accents.atlvs },
                    { phase: "Doors", status: "In progress", tone: accents.compvss },
                    { phase: "Showtime", status: "Queued", tone: accents.gvteway },
                    { phase: "Strike", status: "Queued", tone: accents.gvteway }
                  ].map(item => (
                    <div key={item.phase} className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-[#f5f5f5] px-3 py-2 shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
                      <span className="h-2 w-2 rounded-full" style={{ background: item.tone }} />
                      <div className="flex-1">
                        <p className="text-sm" style={{ fontFamily: "Bebas Neue, var(--font-sans)", letterSpacing: "0.04em" }}>
                          {item.phase}
                        </p>
                        <p className="text-xs text-neutral-600" style={{ fontFamily: "Share Tech Mono, monospace" }}>
                          {item.status}
                        </p>
                      </div>
                      <Button size="sm" variant="secondary" className="h-8 rounded-full border border-neutral-300 bg-white text-xs text-neutral-900">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: "AI Agent", desc: "Draft run of show + staffing with safety gates", tone: accents.atlvs },
                  { title: "Permissions", desc: "Scoped access for Core & Pro collaborators", tone: accents.gvteway }
                ].map(item => (
                  <div key={item.title} className="rounded-xl border border-neutral-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-neutral-600" style={{ fontFamily: "Share Tech Mono, monospace" }}>
                      {item.title}
                    </p>
                    <p className="mt-2 text-base text-neutral-900" style={{ fontFamily: "Share Tech, sans-serif" }}>
                      {item.desc}
                    </p>
                    <div className="mt-3 h-1.5 rounded-full bg-neutral-100">
                      <div className="h-full rounded-full" style={{ width: item.title === "AI Agent" ? "78%" : "92%", background: item.tone }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-neutral-300 bg-[#f5f5f5] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]" style={{ fontFamily: "Share Tech, sans-serif" }}>
        <p className="text-base text-neutral-900">White-Label Highlight</p>
        <p className="mt-2 text-sm text-[#4a4a4a]">
          Make it yours. Enterprise customers can fully rebrand auth screens, dashboards, and team portals with custom logos, colors, and custom domains. Public marketing pages stay ATLVS/COMPVSS/GVTEWAY branded.
        </p>
      </div>
    </section>
  )
}

function ProductsSection() {
  const filteredCards = ecosystemCards

  return (
    <section id="products" className="mt-16 space-y-8">
      <SectionHeader
        kicker="Platform Suite"
        title="Three Platforms. One Unified Ecosystem."
        description="A unified data architecture connecting production management, operations control, and audience engagement—purpose-built for live entertainment professionals who refuse to compromise."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {filteredCards.map(card => (
          <article
            key={card.id}
            className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_14px_40px_rgba(0,0,0,0.12)] transition hover:-translate-y-1 hover:shadow-[0,18px,48px_rgba(0,0,0,0.16)]"
            style={{ fontFamily: "Share Tech, sans-serif" }}
          >
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-neutral-800" style={{ fontFamily: "Share Tech Mono, monospace" }}>
              <Square className="h-3 w-3" style={{ color: accents[card.id], fill: accents[card.id] }} />
              {card.icon}
            </div>
            <div className="mt-3 flex-1 space-y-3">
              <h3 className="text-2xl capitalize" style={{ fontFamily: "Anton, var(--font-sans)" }}>
                {card.title}
              </h3>
              <p className="text-sm text-[#4a4a4a]">{card.desc}</p>
              <div className="flex min-h-[210px] flex-col gap-2 rounded-xl border border-neutral-200 bg-[#f7f7f7] p-3 text-sm text-neutral-900">
                <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-700" style={{ fontFamily: "Share Tech Mono, monospace" }}>
                  Advantages of {card.title}
                </p>
                <ul className="space-y-1" style={{ fontFamily: "Share Tech, sans-serif" }}>
                  {[card.planning, card.execution, card.governance].map(point => (
                    <li key={point} className="flex items-start gap-2 leading-relaxed">
                      <span className="mt-1 h-2 w-2 rounded-full" style={{ background: accents[card.id] }} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button className="rounded-full bg-black px-4 text-xs font-semibold text-white shadow" size="sm">
                {card.ctaPrimary}
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {productTestimonials.map(testimonial => (
          <div
            key={testimonial.quote}
            className="rounded-xl border border-neutral-200 bg-[#f5f5f5] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]"
            style={{ fontFamily: "Share Tech, sans-serif" }}
          >
            <p className="text-sm text-neutral-900">“{testimonial.quote}”</p>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-neutral-700" style={{ fontFamily: "Share Tech Mono, monospace" }}>
              {testimonial.name}
            </p>
            <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-600" style={{ fontFamily: "Share Tech Mono, monospace" }}>
              {testimonial.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function SolutionsSection() {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const scrollBy = (direction: "left" | "right") => {
    const node = scrollRef.current
    if (!node) return
    const delta = direction === "left" ? -280 : 280
    node.scrollBy({ left: delta, behavior: "smooth" })
  }

  return (
    <section id="solutions" className="mt-16 space-y-6">
      <SectionHeader kicker="Industry Solutions" title="Purpose-Built for Every Live Entertainment Format" />
      <div className="relative overflow-hidden rounded-[20px] border border-neutral-300 bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
        <div className="flex gap-3 overflow-x-auto pb-2" ref={scrollRef}>
          {solutions.map(solution => (
            <article
              key={solution.title}
              className="min-w-[240px] flex-1 rounded-xl border border-neutral-200 bg-[#f5f5f5] p-4 shadow-inner transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-neutral-700" style={{ fontFamily: "Share Tech Mono, monospace" }}>
                <Square className="h-3 w-3" style={{ color: solution.accent, fill: solution.accent }} />
                {solution.title}
              </div>
              <p className="mt-3 text-sm text-neutral-800" style={{ fontFamily: "Share Tech, sans-serif" }}>
                {solution.desc}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-neutral-700" style={{ fontFamily: "Share Tech Mono, monospace" }}>
                Learn more
                <ChevronRight className="h-4 w-4" />
              </div>
            </article>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1 pr-6">
          <Button
            size="icon"
            variant="outline"
            className="pointer-events-auto h-9 w-9 rounded-full border-neutral-300 bg-white/90 text-neutral-800 shadow"
            onClick={() => scrollBy("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pl-6 pr-1">
          <Button
            size="icon"
            variant="outline"
            className="pointer-events-auto h-9 w-9 rounded-full border-neutral-300 bg-white/90 text-neutral-800 shadow"
            onClick={() => scrollBy("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="mt-16 space-y-6">
      <SectionHeader kicker="Features" title="Why Leading Operators Choose ATLVS" description="Built by live entertainment veterans with 13+ years of field-tested operations expertise." />
      <div className="grid gap-4 md:grid-cols-2">
        {features.map((feature, idx) => (
          <article
            key={feature.title}
            className="group relative overflow-hidden rounded-2xl border border-neutral-300 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(0,0,0,0.12)]"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-neutral-700" style={{ fontFamily: "Share Tech Mono, monospace" }}>
              <span className="rounded-md bg-neutral-900 px-2 py-1 text-white">{String(idx + 1).padStart(2, "0")}</span>
              Feature
            </div>
            <p className="mt-3 text-lg text-neutral-900" style={{ fontFamily: "Share Tech, sans-serif" }}>
              {feature.title}
            </p>
            <p className="mt-2 text-sm text-[#4a4a4a] opacity-0 transition group-hover:opacity-100" style={{ fontFamily: "Share Tech, sans-serif" }}>
              {feature.desc}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

function PricingSection({ onRequestDemo }: { onRequestDemo?: () => void }) {
  return (
    <section id="pricing" className="mt-16 space-y-8">
      <SectionHeader kicker="Pricing" title="Transparent Pricing. Unlimited Scale." description="Plans designed for every role—from individual crew members to global production enterprises." />
      <div className="grid gap-6 lg:grid-cols-3">
        {pricingPlans.map(plan => (
          <article key={plan.id} className="flex h-full flex-col justify-between rounded-2xl border border-neutral-300 bg-white p-5 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-neutral-800" style={{ fontFamily: "Share Tech Mono, monospace" }}>
                <Square className="h-3 w-3" style={{ color: plan.accent, fill: plan.accent }} />
                {plan.tagline}
              </div>
              <h3 className="text-3xl capitalize" style={{ fontFamily: "Anton, var(--font-sans)" }}>
                {plan.name}
              </h3>
              <p className="text-sm text-[#4a4a4a]" style={{ fontFamily: "Share Tech, sans-serif" }}>
                {plan.cadence}
              </p>
              <p className="text-4xl font-semibold" style={{ fontFamily: "Anton, var(--font-sans)" }}>
                {plan.price}
              </p>
              <div className="space-y-2 text-sm text-neutral-900" style={{ fontFamily: "Share Tech, sans-serif" }}>
                <p className="font-semibold">Who it’s for:</p>
                <div className="flex flex-wrap gap-2 text-[#4a4a4a]">
                  {plan.audience.map(persona => (
                    <span
                      key={persona}
                      className="rounded-full border border-neutral-200 bg-[#f5f5f5] px-3 py-1 text-xs font-semibold"
                    >
                      {persona}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex min-h-[220px] flex-col space-y-2 text-sm text-neutral-900" style={{ fontFamily: "Share Tech, sans-serif" }}>
                <p className="font-semibold">Includes:</p>
                <ul className="list-disc space-y-1 pl-5 text-[#4a4a4a]">
                  {plan.includes.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <Button
                size="lg"
                className="w-full rounded-full px-4 text-sm font-semibold text-black transition hover:-translate-y-0.5"
                style={{ background: plan.accent, boxShadow: `0 10px 25px ${plan.accent}44` }}
                onClick={plan.id === "enterprise" ? onRequestDemo : undefined}
              >
                {plan.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </article>
        ))}
      </div>
      <div className="rounded-2xl border border-neutral-300 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
        <h4 className="text-2xl capitalize" style={{ fontFamily: "Anton, var(--font-sans)" }}>
          Enterprise Add-Ons
        </h4>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {addOns.map(addOn => (
            <div key={addOn.name} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-[#f5f5f5] px-4 py-3 text-sm text-neutral-900" style={{ fontFamily: "Share Tech, sans-serif" }}>
              <div>
                <p className="font-semibold">{addOn.name}</p>
                {addOn.note ? <p className="text-xs text-[#4a4a4a]">{addOn.note}</p> : null}
              </div>
              <span className="text-neutral-800">{addOn.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SocialProofSection() {
  const marqueeRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = marqueeRef.current
    if (!node) return
    let frame: number
    const tick = () => {
      node.scrollLeft += 1
      if (node.scrollLeft >= node.scrollWidth / 2) {
        node.scrollLeft = 0
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <section id="trust" className="mt-16 space-y-6">
      <SectionHeader kicker="Trust" title="Trusted by Industry Leaders" />
      <div className="rounded-[18px] border border-neutral-300 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <div
          className="flex gap-4 overflow-x-hidden text-sm text-neutral-800"
          style={{ fontFamily: "Share Tech Mono, monospace" }}
          ref={marqueeRef}
        >
          {[...trustLogos, ...trustLogos].map((logo, idx) => (
            <span
              key={`${logo}-${idx}`}
              className="shrink-0 rounded-full border border-neutral-200 bg-[#f5f5f5] px-4 py-2 shadow-inner"
            >
              {logo}
            </span>
          ))}
        </div>
        {trustStats.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.16em] text-neutral-700" style={{ fontFamily: "Share Tech Mono, monospace" }}>
            {trustStats.map(stat => (
              <span key={stat} className="rounded-full border border-neutral-200 bg-white px-3 py-1">
                {stat}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function FAQSection() {
  return (
    <section id="faq" className="mt-16 rounded-[24px] border border-neutral-300 bg-white p-6 shadow-[0_14px_44px_rgba(0,0,0,0.05)]">
      <SectionHeader kicker="FAQ" title="Frequently Asked Questions" description="Everything you need to know about the ATLVS platform." />
      <Accordion type="single" collapsible className="mt-6 divide-y divide-neutral-200">
        {faqs.map(({ q, a }, idx) => (
          <AccordionItem key={q} value={`faq-${idx}`} className="border-none">
            <AccordionTrigger className="text-left text-sm font-medium text-neutral-900 hover:no-underline" style={{ fontFamily: "Share Tech, sans-serif" }}>
              <div className="flex w-full items-center justify-between">
                <span>{q}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-[var(--text-primary)]" style={{ fontFamily: "Share Tech, sans-serif" }}>
              {a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

function CTASection({ onRequestDemo, onGetStarted }: { onRequestDemo?: () => void; onGetStarted?: () => void }) {
  return (
    <section
      className="mt-16 overflow-hidden rounded-[28px] border border-neutral-300 px-6 py-12 text-[#0f0f10] shadow-[0_12px_36px_rgba(0,0,0,0.12)]"
      style={{ backgroundImage: tokens.colors.gradients.primary }}
    >
      <div className="grid gap-8">
        <div className="space-y-4">
          <h3 className="text-4xl sm:text-5xl capitalize" style={{ fontFamily: "Anton, var(--font-sans)" }}>
            Ready to Transform Your Operations?
          </h3>
          <p className="text-sm" style={{ fontFamily: "Share Tech, sans-serif" }}>
            From boutique productions to 400,000-attendee festivals, ATLVS delivers the operational clarity your team needs to execute flawlessly.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="h-11 rounded-full bg-black px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5" onClick={onRequestDemo}>
              Request Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-11 rounded-full border border-neutral-300 bg-[#f5f5f5] px-6 text-sm font-semibold text-neutral-900 shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5" onClick={onGetStarted}>
              Get Started Free
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function FooterSection() {
  const footerColumns = [
    {
      title: "Product",
      links: [
        { label: "Search (PeopleGPT)", href: "#products" },
        { label: "Outreach", href: "#products" },
        { label: "Juicebox Agent", href: "#products" },
        { label: "Chrome Extension", href: "#products" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Docs", href: "/docs" },
        { label: "Pricing", href: "#pricing" },
        { label: "Referral", href: "#" },
        { label: "Partners", href: "#" },
        { label: "Search Library", href: "#" },
        { label: "Help Center", href: "#" },
        { label: "Customers", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "LinkedIn", href: "https://www.linkedin.com" },
        { label: "X / Twitter", href: "https://twitter.com" }
      ]
    },
    {
      title: "Security",
      links: [
        { label: "Status", href: "/status" },
        { label: "Trust Center", href: "#" },
        { label: "AI Audit Center", href: "#" },
        { label: "Privacy Choices", href: "#" },
        { label: "Responsible Disclosure", href: "#" }
      ]
    }
  ]

  const openCTA = () => {
    window.open("https://calendly.com/ghxstship/sync", "_blank", "noopener,noreferrer")
  }

  return (
    <footer
      className="mt-16 text-[#e8e8f0]"
      style={{
        background: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 35%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.06), transparent 30%), linear-gradient(135deg, #150d26 0%, #0d081a 55%, #0a0716 100%)"
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-14">
        <div className="space-y-2" style={{ fontFamily: "Share Tech, sans-serif" }}>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b6b0d0]" style={{ fontFamily: "Share Tech Mono, monospace" }}>
            ATLVS Suite
          </div>
          <p className="max-w-2xl text-sm text-[#d5d0ea]">
            The live entertainment operations platform powering production, operations, and audience experience teams worldwide.
          </p>
        </div>
        <div className="grid gap-10 md:grid-cols-5" style={{ fontFamily: "Share Tech, sans-serif" }}>
          {footerColumns.map((col) => (
            <div key={col.title} className="space-y-4">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b6b0d0]" style={{ fontFamily: "Share Tech Mono, monospace" }}>
                {col.title}
              </div>
              <ul className="space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="transition-colors duration-150 hover:text-[var(--color-accent-primary)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b6b0d0]" style={{ fontFamily: "Share Tech Mono, monospace" }}>
              ATLVS in action
            </div>
            <div className="space-y-3 text-sm">
              <a href="/trial" className="block transition-colors duration-150 hover:text-[var(--color-accent-primary)]">
                Free Trial
              </a>
              <a href="/signin" className="block transition-colors duration-150 hover:text-[var(--color-accent-primary)]">
                Sign In
              </a>
              <div className="flex items-center gap-3 pt-3">
                <Button
                  size="sm"
                  className="h-11 rounded-full bg-[var(--color-accent-primary)] px-5 text-sm font-semibold text-black shadow-[0_12px_24px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5"
                  onClick={openCTA}
                >
                  Create Your ATLVS
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-[#c8c3dd] md:flex-row md:items-center md:justify-between" style={{ fontFamily: "Share Tech, sans-serif" }}>
          <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <span style={{ fontFamily: "Share Tech Mono, monospace" }}>© 2026 Juicebox</span>
            <a className="hover:text-[var(--color-accent-primary)]" href="/privacy">Privacy policy</a>
            <a className="hover:text-[var(--color-accent-primary)]" href="/terms">Terms of Service</a>
            <a className="hover:text-[var(--color-accent-primary)]" href="/cookies">Cookie Policy</a>
            <a className="hover:text-[var(--color-accent-primary)]" href="/choices">Cookie Choices</a>
            <a className="hover:text-[var(--color-accent-primary)]" href="/gdpr">GDPR &amp; CCPA</a>
            <a className="hover:text-[var(--color-accent-primary)]" href="/donotsell">Do Not Sell My Info</a>
            <a className="hover:text-[var(--color-accent-primary)]" href="/status">Status</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
