
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Header } from "@/lib/design-system"

const innovationHighlights = [
  {
    title: "AI-Powered Production Planning",
    description: "Machine learning algorithms that optimize event scheduling, resource allocation, and risk assessment.",
    impact: "Reduced planning time by 60%, improved budget accuracy by 40%",
    category: "AI/ML"
  },
  {
    title: "Unified Data Architecture",
    description: "Single source of truth with real-time synchronization across all platform modules and integrations.",
    impact: "Eliminated data silos, enabled instant cross-platform insights",
    category: "Platform"
  },
  {
    title: "White-Label Technology",
    description: "Configurable branding system allowing complete customization for different organizations and markets.",
    impact: "Enabled 50+ branded deployments, accelerated market expansion",
    category: "Design"
  },
  {
    title: "Real-Time Collaboration",
    description: "Live editing, instant messaging, and synchronized workflows for distributed teams.",
    impact: "Increased team productivity by 35%, reduced communication errors",
    category: "Collaboration"
  },
  {
    title: "Predictive Analytics",
    description: "Forecast attendance, revenue, and resource needs using historical data and market trends.",
    impact: "Improved forecasting accuracy to 85%, reduced over/under provisioning",
    category: "Analytics"
  },
  {
    title: "Extended Reality Integration",
    description: "VR/AR capabilities for virtual attendance, hybrid events, and immersive experiences.",
    impact: "Expanded audience reach by 300%, created new revenue streams",
    category: "XR"
  }
]

const technologyStack = [
  {
    category: "AI & Machine Learning",
    technologies: ["TensorFlow", "PyTorch", "Custom ML Models", "NLP Processing", "Computer Vision"],
    applications: ["Demand forecasting", "Content analysis", "Automated scheduling", "Risk assessment"]
  },
  {
    category: "Cloud & Infrastructure",
    technologies: ["AWS", "Google Cloud", "Kubernetes", "Docker", "Serverless Functions"],
    applications: ["Auto-scaling", "Global distribution", "Disaster recovery", "Cost optimization"]
  },
  {
    category: "Data & Analytics",
    technologies: ["PostgreSQL", "Redis", "Elasticsearch", "Apache Kafka", "Apache Spark"],
    applications: ["Real-time processing", "Search optimization", "Event streaming", "Big data analytics"]
  },
  {
    category: "Frontend & Mobile",
    technologies: ["React", "Next.js", "React Native", "TypeScript", "Tailwind CSS"],
    applications: ["Progressive web apps", "Cross-platform mobile", "Real-time interfaces", "Design systems"]
  }
]

const researchAreas = [
  {
    title: "Quantum Computing for Optimization",
    description: "Exploring quantum algorithms for complex event scheduling and resource optimization problems.",
    timeline: "2028-2032",
    status: "Research Phase"
  },
  {
    title: "Neural Interfaces",
    description: "Brain-computer interfaces for seamless human-AI collaboration in creative processes.",
    timeline: "2030-2035",
    status: "Early Development"
  },
  {
    title: "Autonomous Event Production",
    description: "Fully automated event execution with AI directors and robotic stage management.",
    timeline: "2032-2040",
    status: "Concept Phase"
  },
  {
    title: "Holographic Entertainment",
    description: "Real-time holographic performances and interactive experiences.",
    timeline: "2035-2045",
    status: "Research Phase"
  }
]

export default function Innovation() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Breadcrumb */}
      <nav className="bg-muted/50 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-foreground">About</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Innovation</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Innovation at Scale
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            We&apos;re pushing the boundaries of technology to transform live entertainment.
            From AI-powered operations to immersive experiences, we&apos;re building the future today.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm">AI-First Platform</Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">Cloud-Native Architecture</Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">Research & Development</Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">Open Innovation</Badge>
          </div>
        </div>
      </section>

      {/* Innovation Highlights */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Key Innovations</h2>
            <p className="text-xl text-muted-foreground">
              Breakthrough technologies that are transforming the entertainment industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {innovationHighlights.map((innovation, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{innovation.title}</CardTitle>
                    <Badge variant="outline">{innovation.category}</Badge>
                  </div>
                  <CardDescription className="text-base">
                    {innovation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-accent-primary/10 rounded-lg p-4">
                    <p className="text-sm font-medium text-accent-primary">
                      Impact: {innovation.impact}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Technology Stack</h2>
            <p className="text-xl text-muted-foreground">
              Modern technologies powering our platform and enabling innovation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {technologyStack.map((stack, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{stack.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {stack.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Applications</h4>
                    <ul className="space-y-1">
                      {stack.applications.map((app, appIndex) => (
                        <li key={appIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-accent-primary rounded-full"></div>
                          <span className="text-sm text-muted-foreground">{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* R&D Pipeline */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Research & Development</h2>
            <p className="text-xl text-muted-foreground">
              Exploring the frontiers of entertainment technology and human experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {researchAreas.map((research, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{research.title}</CardTitle>
                  <CardDescription className="text-base">
                    {research.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Timeline</p>
                      <p className="text-sm text-muted-foreground">{research.timeline}</p>
                    </div>
                    <Badge variant="outline">{research.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Innovation */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Open Innovation</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We believe innovation thrives in open ecosystems. Our platform is built with
                extensibility in mind, enabling partners and developers to build upon our technology.
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-accent-primary pl-4">
                  <h3 className="font-semibold mb-2">Developer Platform</h3>
                  <p className="text-muted-foreground">
                    Comprehensive APIs, SDKs, and documentation enabling third-party integrations
                    and custom solutions.
                  </p>
                </div>
                <div className="border-l-4 border-accent-secondary pl-4">
                  <h3 className="font-semibold mb-2">Partner Ecosystem</h3>
                  <p className="text-muted-foreground">
                    Strategic partnerships with technology providers, enabling seamless integration
                    of cutting-edge tools and services.
                  </p>
                </div>
                <div className="border-l-4 border-accent-tertiary pl-4">
                  <h3 className="font-semibold mb-2">Research Collaborations</h3>
                  <p className="text-muted-foreground">
                    Academic and industry partnerships driving fundamental research in entertainment
                    technology and human-computer interaction.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Ecosystem</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Our open API platform powers thousands of integrations and enables
                    developers to build innovative solutions on top of our infrastructure.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-accent-primary">500+</div>
                      <div className="text-sm text-muted-foreground">Integrations</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent-primary">100+</div>
                      <div className="text-sm text-muted-foreground">SDK Downloads</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Innovation Lab</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Dedicated research facility exploring emerging technologies and their
                    applications in live entertainment.
                  </p>
                  <Button className="w-full">
                    Learn About Our Research
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-display font-bold mb-4">
            The Future of Entertainment
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            We&apos;re not just building technology; we&apos;re reimagining what&apos;s possible in live entertainment.
            Join us in creating experiences that transcend boundaries and connect humanity.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Immersive Experiences</h3>
              <p className="text-sm text-muted-foreground">
                XR, AI, and sensory technologies creating fully immersive entertainment.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Global Accessibility</h3>
              <p className="text-sm text-muted-foreground">
                Breaking down barriers to make world-class entertainment accessible everywhere.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Sustainable Innovation</h3>
              <p className="text-sm text-muted-foreground">
                Technology that entertains while protecting our planet for future generations.
              </p>
            </div>
          </div>
          <Button size="lg" className="text-lg px-8 py-6">
            Explore Our Technology
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Super App.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
