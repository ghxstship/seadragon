
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/lib/design-system"

const coreValues = [
  {
    title: "Innovation",
    description: "We embrace cutting-edge technology and creative approaches to push the boundaries of live entertainment.",
    icon: "",
    details: [
      "Continuous technological advancement",
      "Creative problem-solving",
      "Future-focused thinking",
      "Research and development investment"
    ]
  },
  {
    title: "Excellence",
    description: "We strive for the highest standards in everything we do, from code quality to production execution.",
    icon: "⭐",
    details: [
      "Quality-first approach",
      "Attention to detail",
      "Performance optimization",
      "Continuous improvement"
    ]
  },
  {
    title: "Collaboration",
    description: "We believe the best results come from diverse teams working together across disciplines and perspectives.",
    icon: "",
    details: [
      "Cross-functional teamwork",
      "Open communication",
      "Inclusive decision-making",
      "Knowledge sharing"
    ]
  },
  {
    title: "Integrity",
    description: "We conduct business with honesty, transparency, and ethical responsibility in all our dealings.",
    icon: "️",
    details: [
      "Ethical business practices",
      "Transparent operations",
      "Data privacy protection",
      "Responsible innovation"
    ]
  },
  {
    title: "Sustainability",
    description: "We are committed to environmental responsibility and creating positive social impact through our work.",
    icon: "",
    details: [
      "Carbon footprint reduction",
      "Environmental conservation",
      "Social responsibility",
      "Long-term thinking"
    ]
  },
  {
    title: "Inclusivity",
    description: "We create platforms and experiences that are accessible to everyone, regardless of background or ability.",
    icon: "",
    details: [
      "Accessibility standards",
      "Diverse representation",
      "Cultural sensitivity",
      "Universal design principles"
    ]
  }
]

const valueStories = [
  {
    title: "Open Source Commitment",
    description: "We released our core API specifications as open source, enabling developers worldwide to build on our platform.",
    impact: "500+ third-party integrations created"
  },
  {
    title: "Accessibility First",
    description: "Built comprehensive accessibility features from day one, ensuring our platform serves users of all abilities.",
    impact: "99.5% accessibility compliance score"
  },
  {
    title: "Carbon Neutral Operations",
    description: "Achieved carbon neutrality across all our data centers and operations through renewable energy and offsets.",
    impact: "Zero carbon footprint since 2030"
  },
  {
    title: "Diversity Initiative",
    description: "Implemented comprehensive diversity hiring and retention programs across all departments and levels.",
    impact: "50% increase in diverse representation"
  }
]

export default function Values() {
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
            <span className="text-foreground font-medium">Our Values</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Our Values
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            The principles that guide our decisions, shape our culture, and drive our mission
            to transform live entertainment through technology and innovation.
          </p>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Core Values</h2>
            <p className="text-xl text-muted-foreground">
              Six fundamental principles that define who we are and how we work
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {value.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-accent-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values in Action */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Values in Action</h2>
            <p className="text-xl text-muted-foreground">
              Real examples of how our values guide our work and impact the industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {valueStories.map((story, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{story.title}</CardTitle>
                  <CardDescription className="text-base">
                    {story.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-accent-primary/10 rounded-lg p-4">
                    <p className="text-sm font-medium text-accent-primary">
                      Impact: {story.impact}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Values Matter */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Why Values Matter</h2>
              <p className="text-lg text-muted-foreground mb-6">
                In an industry built on creativity and human connection, our values ensure that
                technology serves humanity rather than the other way around. They guide our
                innovation and keep us focused on positive impact.
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-accent-primary pl-4">
                  <h3 className="font-semibold mb-2">Human-Centered Design</h3>
                  <p className="text-muted-foreground">
                    Every feature we build starts with understanding human needs and experiences,
                    ensuring technology enhances rather than complicates the creative process.
                  </p>
                </div>
                <div className="border-l-4 border-accent-secondary pl-4">
                  <h3 className="font-semibold mb-2">Ethical Technology</h3>
                  <p className="text-muted-foreground">
                    We prioritize privacy, security, and ethical use of data, building trust
                    with our users and partners through transparent and responsible practices.
                  </p>
                </div>
                <div className="border-l-4 border-accent-tertiary pl-4">
                  <h3 className="font-semibold mb-2">Sustainable Growth</h3>
                  <p className="text-muted-foreground">
                    Our commitment to sustainability extends beyond environmental responsibility
                    to include economic viability and social equity for all stakeholders.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Community Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our values drive community initiatives, educational programs, and partnerships
                    that extend our positive impact beyond our platform.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Industry Leadership</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    By living our values, we set standards for ethical technology use in entertainment,
                    influencing industry practices and norms.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Long-term Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our values ensure we build for the future, creating sustainable solutions
                    that endure and evolve with changing needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Mission */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-display font-bold mb-4">
            Share Our Values
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join a team that lives by these principles. Help us build technology that makes
            live entertainment more accessible, sustainable, and innovative.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Join Our Team
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Partner With Us
            </Button>
          </div>
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
