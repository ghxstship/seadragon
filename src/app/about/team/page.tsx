
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Header } from "@/lib/design-system"

const teamMembers = [
  {
    name: "Jane Smith",
    role: "Chief Executive Officer",
    department: "Executive",
    bio: "20+ years in live entertainment production, former executive at major festivals and venues.",
    expertise: ["Strategic Leadership", "Event Production", "Industry Relations"],
    image: null
  },
  {
    name: "Mike Johnson",
    role: "Chief Technology Officer",
    department: "Technology",
    bio: "Former tech lead at enterprise software companies, specializing in scalable platform architecture.",
    expertise: ["Platform Architecture", "Cloud Infrastructure", "AI/ML"],
    image: null
  },
  {
    name: "Sarah Chen",
    role: "Chief Creative Officer",
    department: "Creative",
    bio: "Award-winning creative director with experience across theater, music, and experiential entertainment.",
    expertise: ["Creative Direction", "Brand Strategy", "Experience Design"],
    image: null
  },
  {
    name: "David Rodriguez",
    role: "Chief Operations Officer",
    department: "Operations",
    bio: "Operations veteran with extensive experience in large-scale event management and logistics.",
    expertise: ["Operations Management", "Logistics", "Risk Management"],
    image: null
  },
  {
    name: "Lisa Park",
    role: "Chief Financial Officer",
    department: "Finance",
    bio: "Finance executive with deep experience in entertainment industry financial management.",
    expertise: ["Financial Planning", "Budget Management", "Investment Strategy"],
    image: null
  },
  {
    name: "Alex Thompson",
    role: "VP of Product",
    department: "Product",
    bio: "Product leader focused on building user-centric platforms for creative industries.",
    expertise: ["Product Strategy", "User Experience", "Agile Development"],
    image: null
  },
  {
    name: "Maria Garcia",
    role: "VP of Marketing",
    department: "Marketing",
    bio: "Marketing innovator specializing in audience engagement and brand building in entertainment.",
    expertise: ["Digital Marketing", "Audience Development", "Brand Management"],
    image: null
  },
  {
    name: "James Wilson",
    role: "VP of Talent",
    department: "Talent",
    bio: "Industry veteran with extensive network in entertainment talent management and booking.",
    expertise: ["Talent Relations", "Artist Management", "Contract Negotiation"],
    image: null
  }
]

const departments = [
  { name: "Executive", count: 5, description: "Strategic leadership and governance" },
  { name: "Technology", count: 25, description: "Platform development and infrastructure" },
  { name: "Creative", count: 15, description: "Design, content, and brand strategy" },
  { name: "Operations", count: 30, description: "Event operations and logistics" },
  { name: "Finance", count: 8, description: "Financial management and analysis" },
  { name: "Marketing", count: 12, description: "Audience development and promotion" },
  { name: "Talent", count: 10, description: "Artist relations and booking" },
  { name: "Product", count: 18, description: "Product development and UX" },
  { name: "Legal", count: 6, description: "Legal affairs and compliance" },
  { name: "HR", count: 7, description: "People operations and culture" }
]

export default function Team() {
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
            <span className="text-foreground font-medium">Our Team</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Our Team
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Meet the passionate professionals dedicated to transforming live entertainment
            through technology and innovation.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm">500+ Team Members</Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">50+ Countries</Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">Decades of Experience</Badge>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Leadership Team</h2>
            <p className="text-xl text-muted-foreground">
              Industry veterans driving innovation in live entertainment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="h-full">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-accent-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-xl font-display font-bold text-accent-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    {member.role}
                  </CardDescription>
                  <Badge variant="outline" className="w-fit mx-auto">
                    {member.department}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Expertise
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {member.expertise.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Department Overview */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Our Departments</h2>
            <p className="text-xl text-muted-foreground">
              Specialized teams working together to deliver exceptional experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                    <Badge variant="secondary">{dept.count}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{dept.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Our Culture</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We believe that great entertainment comes from passionate people working together.
                Our culture is built on creativity, collaboration, and a relentless focus on delivering
                unforgettable experiences.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"></div>
                  <p className="text-muted-foreground">
                    <strong>Innovation First:</strong> We embrace new technologies and creative approaches
                    to push the boundaries of what&apos;s possible in live entertainment.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"></div>
                  <p className="text-muted-foreground">
                    <strong>Collaboration:</strong> We work across disciplines and departments to achieve
                    shared goals and create something greater than the sum of our parts.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"></div>
                  <p className="text-muted-foreground">
                    <strong>Excellence:</strong> We strive for excellence in everything we do, from the
                    smallest detail to the grandest production.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Diversity & Inclusion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our team represents diverse backgrounds, experiences, and perspectives,
                    enriching our creative process and ensuring we serve global audiences.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Work-Life Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We understand the demands of the entertainment industry and support
                    our team in maintaining healthy work-life balance.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Professional Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Continuous learning and growth are core to our culture, with opportunities
                    for training, conferences, and skill development.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-display font-bold mb-4">
            Join Our Team
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Help us shape the future of live entertainment. We&apos;re always looking for
            passionate individuals to join our mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              View Open Positions
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Learn More
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
