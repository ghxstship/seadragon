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
        <SectionHeader kicker="Contact" title="Talk with our team" description="Reach out and we'll respond quickly." />
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
        <SectionHeader kicker="Subscribe" title="Stay in the loop" description="Product updates and launch news." />
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
  { label: "Years experience", value: "13+" },
  { label: "Attendees managed", value: "400K+" },
  { label: "Budgets orchestrated", value: "$10M+" }
]

const personaLabels: Record<PersonaFilter, string> = {
  all: "All",
  production: "Production",
  operations: "Operations",
  experience: "Experience"
}

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
    title: "Production Management",
    desc: "Orchestrate end-to-end production from crew to show day with clear ownership and timelines.",
    icon: "Production",
    persona: "production",
    industry: "Media/Live",
    status: "Most Used",
    workflow: ["Build schedule", "Assign crews", "Track show-day checklists"],
    planning: "Timeline, staffing, and vendor blocks aligned in one view",
    execution: "Crew calls, logistics, and approvals in lockstep with show cues",
    governance: "Scoped access for departments and vendors; auditable changes",
    ctaPrimary: "View Workflows",
    ctaSecondary: "See Pricing Fit"
  },
  {
    id: "atlvs",
    title: "Operations Hub",
    desc: "Run your business, teams, and compliance from a single command center with audit-ready controls.",
    icon: "Operations",
    persona: "operations",
    industry: "Enterprise",
    status: "Live",
    workflow: ["Access policies", "Staff provisioning", "Performance review packets"],
    planning: "Roles, scopes, and policies modeled across teams and partners",
    execution: "Requests, assignments, and comms routed with guardrails",
    governance: "Audit-ready records, approvals, and compliance views",
    ctaPrimary: "View Workflows",
    ctaSecondary: "See Pricing Fit"
  },
  {
    id: "gvteway",
    title: "Consumer Experiences",
    desc: "Launch branded portals and audience programs with governed access and measurable engagement.",
    icon: "Experience",
    persona: "experience",
    industry: "Audience",
    status: "Featured",
    workflow: ["Create portal", "Publish drops", "Measure engagement"],
    planning: "Audience programs, drops, and loyalty mapped to journeys",
    execution: "Publishing, access, and engagement cues in one lane",
    governance: "Permissions, brand safety, and audit trails across surfaces",
    ctaPrimary: "View Workflows",
    ctaSecondary: "See Pricing Fit"
  }
]

const productTestimonials = [
  { quote: "We cut show-day overruns in half while keeping every department on spec.", name: "Capt. Rowan Calder", title: "Master of Production" },
  { quote: "Policies, staffing, and audits stay synced—my leads get clarity without chasing down updates.", name: "Capt. Liora Marlowe", title: "Harbormaster of Operations" },
  { quote: "We launch audience programs with brand safety baked in—and track lift without extra tooling.", name: "Capt. Arjun Tidewell", title: "Commodore of Experience" }
]

const solutions = [
  { title: "Production", desc: "End-to-end show management from pre-production to wrap", accent: accents.atlvs },
  { title: "Installations", desc: "Immersive environment builds and technical deployments", accent: accents.compvss },
  { title: "Activations", desc: "Brand experiences that create lasting impressions", accent: accents.gvteway },
  { title: "Destinations", desc: "Venue and location operations at scale", accent: accents.atlvs },
  { title: "Attractions", desc: "Theme parks, exhibits, and permanent installations", accent: accents.gvteway }
]

const features = [
  {
    title: "End-to-End Live Operations Ecosystem",
    desc: "Unified tooling from intake to wrap with governed access."
  },
  {
    title: "Single Source of Truth Data Architecture",
    desc: "Consolidated data model across teams, vendors, and venues."
  },
  {
    title: "Enterprise-Grade Roles, Permissions & Governance",
    desc: "Scoped roles, audits, and approvals built for high-stakes ops."
  },
  {
    title: "Unlimited Users with Controlled Access",
    desc: "Scale collaborators without losing control of what they see and do."
  },
  {
    title: "Purpose-Built Live Entertainment Workflows",
    desc: "Run-of-show, logistics, and field workflows designed by operators."
  },
  {
    title: "Native Integrations + OpenAPI",
    desc: "Calendar, storage, comms, and extensibility via OpenAPI."
  },
  {
    title: "Advanced Dashboards, Views & Reporting",
    desc: "Operational telemetry across projects, crews, and guests."
  },
  {
    title: "AI-Powered Interface, Automation & Insights",
    desc: "Guardrailed AI suggestions for schedules, staffing, and logistics."
  },
  {
    title: "Multi-Organization Ecosystem Collaboration",
    desc: "Vendors, agencies, venues, and brands aligned in one workspace."
  },
  {
    title: "Live Intelligence with Offline Syncing",
    desc: "Stay online even when connectivity drops on-site."
  },
  {
    title: "Public-Facing Branded Profiles & Portals",
    desc: "Share live states and experiences via GVTEWAY surfaces."
  },
  {
    title: "Full White-Label Branding (Enterprise)",
    desc: "Custom logos, colors, and domains across auth and dashboards."
  },
  {
    title: "Live Intelligence for Physical Experiences",
    desc: "Fuse physical signals into operational decisioning."
  },
  {
    title: "Designed by Operators, for Operators",
    desc: "Built with field-tested playbooks from real productions."
  }
]

const pricingPlans = [
  {
    id: "core",
    name: "Core",
    price: "$0",
    cadence: "Forever Free",
    tagline: "Work Here",
    audience: ["Crew", "Artists", "Vendors", "Interns", "Guests", "Volunteers"],
    includes: ["Workforce + collaborator access layer", "Read-only + scoped task actions"],
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
    audience: ["Production managers", "Tour managers", "Department leads", "Vendors running sub-teams", "Embedded freelancers"],
    includes: [
      "Full write access within assigned scopes",
      "Manage Core users within scope",
      "Limited integrations (calendar, storage)",
      "Limited AI Agent (usage-capped)",
      "Advanced reporting for assigned scopes"
    ],
    limits: ["Cannot create projects", "Cannot change global settings", "No billing/domain/API", "AI + automation caps"],
    cta: "Start Pro Trial",
    accent: accents.compvss
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$1,499",
    cadence: "Starting Monthly Base",
    tagline: "Create Here",
    audience: ["Production companies", "Festivals", "Venues", "Brands", "Agencies", "Promoters", "Municipalities"],
    includes: [
      "Project creation (exclusive)",
      "Unlimited internal users (domain-verified)",
      "Unlimited external Core + Pro collaborators",
      "Full integrations suite",
      "Full AI Agent access",
      "OpenAPI access",
      "Full white-label branding",
      "GVTEWAY public-facing tools",
      "Global permissions, data, governance",
      "Up to 10 active projects",
      "Custom Automations",
      "Priority Support"
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
  { q: "What's the difference between ATLVS, COMPVSS, and GVTEWAY?", a: "ATLVS is the internal operations hub, COMPVSS handles production management, and GVTEWAY powers public-facing experiences." },
  { q: "Can I start with Core and upgrade later?", a: "Yes. Core users can be upgraded to Pro or invited into Enterprise projects at any time." },
  { q: "How does the AI Agent work?", a: "AI-powered interface provides automation suggestions, insights, and workflow optimization based on your production data." },
  { q: "Is there a mobile app?", a: "Yes, with offline syncing for on-site operations where connectivity is limited." },
  { q: "What integrations are available?", a: "Native calendar, storage, comms, plus OpenAPI for custom integrations (Enterprise)." },
  { q: "How does white-labeling work?", a: "Enterprise customers can fully rebrand auth screens, dashboards, and team interfaces with custom logos, colors, and domains." }
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
          <Button className="hidden h-10 rounded-full bg-black px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 md:inline-flex" onClick={openCalendly}>
            Request Demo
          </Button>
          <Button
            className="hidden h-10 rounded-full border border-neutral-300 bg-[#f5f5f5] px-5 text-sm font-semibold text-neutral-900 shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 md:inline-flex"
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
              <Button className="h-10 w-full rounded-full bg-black px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)]" onClick={openCalendly}>
                Request Demo
              </Button>
              <Button
                className="h-10 w-full rounded-full border border-neutral-300 bg-[#f5f5f5] px-5 text-sm font-semibold text-neutral-900 shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5"
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
            Live Intelligence for Physical Experiences
          </div>
          <h1 className="text-5xl leading-tight sm:text-6xl lg:text-7xl capitalize" style={{ fontFamily: "Anton, var(--font-sans)" }}>
            Orchestrate. Communicate. Dominate.
          </h1>
          <p className="text-base text-[#4a4a4a] sm:text-lg" style={{ fontFamily: "Share Tech, sans-serif" }}>
            The end-to-end ecosystem powering live entertainment operations—from intimate theater productions to 400K+ attendee festivals and $10M+ budgets.
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
              <span>ATLVS Dashboard</span>
              <span className="text-[--accent-atlvs]" style={{ "--accent-atlvs": accents.atlvs } as CSSProperties}>
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
                  <div key={metric.label} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-600" style={{ fontFamily: "Share Tech Mono, monospace" }}>
                      {metric.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold" style={{ color: metric.tone }}>
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
  const [personaFilter, setPersonaFilter] = useState<PersonaFilter>("all")
  const [compareMode, setCompareMode] = useState(false)
  const [peekCard, setPeekCard] = useState<AccentKey | null>(null)

  const filteredCards = personaFilter === "all" ? ecosystemCards : ecosystemCards.filter(card => card.persona === personaFilter)

  return (
    <section id="products" className="mt-16 space-y-8">
      <SectionHeader
        kicker="Products"
        title="Three Platforms. One Suite."
        description="A shared data, permissions, and orchestration fabric built for Production, Operations, and Experience teams."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-300 bg-white p-3 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Product personas">
          {Object.entries(personaLabels).map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={personaFilter === key}
              onClick={() => setPersonaFilter(key as PersonaFilter)}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                personaFilter === key ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-800" style={{ fontFamily: "Share Tech, sans-serif" }}>
          <input type="checkbox" checked={compareMode} onChange={e => setCompareMode(e.target.checked)} className="h-4 w-4 rounded border-neutral-400" />
          Compare
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {filteredCards.map(card => (
          <article
            key={card.id}
            className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_14px_40px_rgba(0,0,0,0.12)] transition hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(0,0,0,0.16)]"
            style={{ fontFamily: "Share Tech, sans-serif" }}
          >
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-neutral-800" style={{ fontFamily: "Share Tech Mono, monospace" }}>
              <div className="flex items-center gap-2">
                <Square className="h-3 w-3" style={{ color: accents[card.id], fill: accents[card.id] }} />
                {card.icon}
              </div>
              <span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] font-semibold text-neutral-700">{card.status}</span>
            </div>
            <h3 className="mt-3 text-2xl capitalize" style={{ fontFamily: "Anton, var(--font-sans)" }}>
              {card.title}
            </h3>
            <p className="mt-2 text-sm text-[#4a4a4a]">{card.desc}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-neutral-700" style={{ fontFamily: "Share Tech Mono, monospace" }}>
              <button
                className="rounded-full border border-neutral-300 bg-neutral-100 px-3 py-2 text-[11px] font-semibold transition hover:border-neutral-400"
                onClick={() => setPeekCard(peekCard === card.id ? null : card.id)}
              >
                Workflow Peek
              </button>
            </div>

            {peekCard === card.id ? (
              <div className="mt-3 space-y-2 rounded-xl border border-neutral-200 bg-[#f7f7f7] p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-700" style={{ fontFamily: "Share Tech Mono, monospace" }}>
                  {card.ctaPrimary}
                </p>
                <ol className="space-y-1 text-sm text-neutral-900">
                  {card.workflow.map(step => (
                    <li key={step} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: accents[card.id] }} />
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            <div className="mt-4 flex flex-col gap-2 text-sm text-neutral-900">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-neutral-600" style={{ fontFamily: "Share Tech Mono, monospace" }}>
                <span className="h-2 w-2 rounded-full" style={{ background: accents[card.id] }} />
                Shared data layer guarantees
              </div>
              <div className="flex flex-wrap gap-2 text-xs" style={{ fontFamily: "Share Tech Mono, monospace" }}>
                {"Permissions · Auditability · Interoperability".split(" · ").map(item => (
                  <span key={item} className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-800">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {compareMode ? (
              <div className="mt-4 space-y-2 rounded-xl border border-neutral-200 bg-[#f9f9f9] p-3 text-sm text-neutral-900">
                <div className="flex items-start gap-2">
                  <span className="text-xs uppercase tracking-[0.14em] text-neutral-600" style={{ fontFamily: "Share Tech Mono, monospace" }}>
                    Planning
                  </span>
                  <p>{card.planning}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs uppercase tracking-[0.14em] text-neutral-600" style={{ fontFamily: "Share Tech Mono, monospace" }}>
                    Execution
                  </span>
                  <p>{card.execution}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs uppercase tracking-[0.14em] text-neutral-600" style={{ fontFamily: "Share Tech Mono, monospace" }}>
                    Governance
                  </span>
                  <p>{card.governance}</p>
                </div>
              </div>
            ) : null}

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
      <SectionHeader kicker="Solutions" title="Built for Every Live Experience" />
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
      <SectionHeader kicker="Features" title="Why Operators Choose ATLVS" description="Designed by operators, for operators." />
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
      <SectionHeader kicker="Pricing" title="Transparent. Flexible. Scalable." description="From crew members to global production companies." />
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
                <ul className="list-disc space-y-1 pl-5 text-[#4a4a4a]">
                  {plan.audience.map(persona => (
                    <li key={persona}>{persona}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2 text-sm text-neutral-900" style={{ fontFamily: "Share Tech, sans-serif" }}>
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
      <SectionHeader kicker="Trust" title="Tested Across the Industry" />
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
      <SectionHeader kicker="FAQ" title="Frequently Asked Questions" description="No worries, here you can find all the answers." />
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
            Ready to chart a new path?
          </h3>
          <p className="text-sm" style={{ fontFamily: "Share Tech, sans-serif" }}>
            Whether you’re running a 50-person crew or a 400,000-attendee festival, ATLVS scales with you.
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
  return (
    <footer className="mt-16 border-t border-neutral-300 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3" style={{ fontFamily: "Share Tech, sans-serif" }}>
            <div className="text-lg font-semibold text-neutral-900">ATLVS Suite</div>
            <p className="text-sm text-[#4a4a4a]">Live ops, governance, and experience delivery for production, operations, and audience teams.</p>
          </div>
          <div className="space-y-3" style={{ fontFamily: "Share Tech, sans-serif" }}>
            <div className="text-xs uppercase tracking-[0.14em] text-neutral-600" style={{ fontFamily: "Share Tech Mono, monospace" }}>Contact</div>
            <a className="block text-sm text-neutral-800 hover:text-[var(--text-primary)]" href="mailto:hello@atlvs.one">hello@atlvs.one</a>
            <a className="block text-sm text-neutral-800 hover:text-[var(--text-primary)]" href="tel:+18885551234">+1 (888) 555-1234</a>
            <div className="flex items-center gap-3 text-sm text-neutral-800">
              <a className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-[#f5f5f5] text-neutral-800 hover:text-[var(--text-primary)]" href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                in
              </a>
              <a className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-[#f5f5f5] text-neutral-800 hover:text-[var(--text-primary)]" href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                IG
              </a>
              <a className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-[#f5f5f5] text-neutral-800 hover:text-[var(--text-primary)]" href="https://www.tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
                TT
              </a>
              <a className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-[#f5f5f5] text-neutral-800 hover:text-[var(--text-primary)]" href="https://bsky.app" target="_blank" rel="noreferrer" aria-label="Bluesky">
                Bsky
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[#4a4a4a]" style={{ fontFamily: "Share Tech Mono, monospace" }}>
            © 2026 G H X S T S H I P Industries LLC
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-700" style={{ fontFamily: "Share Tech, sans-serif" }}>
            <a className="hover:text-[var(--text-primary)]" href="/privacy">Privacy Policy</a>
            <a className="hover:text-[var(--text-primary)]" href="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
