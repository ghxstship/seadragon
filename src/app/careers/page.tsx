
'use client'


import { logger } from "@/lib/logger"
import { Briefcase, Users, Heart, MapPin, Search, Building2, Award, Coffee, Globe, Zap, Star, ArrowRight, CheckCircle, Clock, DollarSign, Home, Plane } from "lucide-react"

interface JobApiResponse {
  id: string | number
  title?: string
  department?: string
  location?: string
  type?: string
  level?: string
  salary?: string
  featured?: boolean
  urgent?: boolean
  posted_date?: string
  created_at?: string
  description?: string
  requirements?: string[]
  benefits?: string[]
}

interface JobOpening {
  id: string
  title: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive'
  salary: string
  featured: boolean
  urgent: boolean
  postedDate: Date
  description: string
  requirements: string[]
  benefits: string[]
}

interface JobOpening {
  id: string
  title: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive'
  salary: string
  featured: boolean
  urgent: boolean
  postedDate: Date
  description: string
  requirements: string[]
  benefits: string[]
}

interface CompanyValue {
  icon: string
  title: string
  description: string
  color: string
}

interface EmployeeBenefit {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  category: 'health' | 'financial' | 'work-life' | 'professional' | 'travel'
}

interface OfficeLocation {
  city: string
  country: string
  type: 'headquarters' | 'office' | 'remote-hub'
  employeeCount: number
  image: string
}

export default function CareersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadJobs = async () => {
      try {
        // Fetch jobs from API
        const res = await fetch('/api/v1/jobs')
        if (res.ok) {
          const data = await res.json()
          const jobs = Array.isArray(data.jobs) ? data.jobs : []
          const mapped: JobOpening[] = jobs.map((j: JobApiResponse) => ({
            id: String(j.id),
            title: String(j.title || 'Position'),
            department: String(j.department || 'General'),
            location: String(j.location || 'Remote'),
            type: (j.type as 'full-time' | 'part-time' | 'contract' | 'internship') || 'full-time',
            level: (j.level as 'entry' | 'mid' | 'senior' | 'lead' | 'executive') || 'mid',
            salary: String(j.salary || 'Competitive'),
            featured: Boolean(j.featured),
            urgent: Boolean(j.urgent),
            postedDate: new Date(j.posted_date || j.created_at || Date.now()),
            description: String(j.description || ''),
            requirements: Array.isArray(j.requirements) ? j.requirements : [],
            benefits: Array.isArray(j.benefits) ? j.benefits : []
          }))
          if (!cancelled) {
            setJobOpenings(mapped)
            setLoading(false)
          }
        } else {
          if (!cancelled) {
            setJobOpenings([])
            setLoading(false)
          }
        }
      } catch (error) {
        logger.error('Error loading jobs:', error)
        if (!cancelled) {
          setJobOpenings([])
          setLoading(false)
        }
      }
    }

    loadJobs()

    return () => { cancelled = true }
  }, [])

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || job.department === selectedDepartment
    const matchesLocation = selectedLocation === "all" || job.location.includes(selectedLocation)
    const matchesType = selectedType === "all" || job.type === selectedType
    return matchesSearch && matchesDepartment && matchesLocation && matchesType
  })

  const companyValues: CompanyValue[] = [
    {
      icon: "",
      title: "Innovation",
      description: "We embrace new technologies and push boundaries in travel",
      color: "bg-accent-primary/10"
    },
    {
      icon: "",
      title: "Sustainability",
      description: "Responsible travel that protects our planet and communities",
      color: "bg-semantic-success/10"
    },
    {
      icon: "",
      title: "Inclusivity",
      description: "Travel accessible to everyone, everywhere, regardless of background",
      color: "bg-accent-primary/10"
    },
    {
      icon: "⭐",
      title: "Excellence",
      description: "Delivering exceptional experiences that exceed expectations",
      color: "bg-semantic-warning/10"
    },
    {
      icon: "",
      title: "Collaboration",
      description: "Working together to create something greater than the sum of our parts",
      color: "bg-pink-100"
    },
    {
      icon: "",
      title: "Impact",
      description: "Making a meaningful difference in how people experience the world",
      color: "bg-semantic-warning/10"
    }
  ]

  const employeeBenefits: EmployeeBenefit[] = [
    {
      icon: Heart,
      title: "Comprehensive Health Coverage",
      description: "Medical, dental, and vision insurance with low premiums",
      category: "health"
    },
    {
      icon: DollarSign,
      title: "Competitive Compensation",
      description: "Market-leading salaries with equity participation",
      category: "financial"
    },
    {
      icon: Home,
      title: "Flexible Work Options",
      description: "Remote, hybrid, or office-based arrangements",
      category: "work-life"
    },
    {
      icon: Plane,
      title: "Travel Credits & Discounts",
      description: "Employee discounts on all our travel services",
      category: "travel"
    },
    {
      icon: Users,
      title: "Professional Development",
      description: "Learning stipends, conference attendance, and growth opportunities",
      category: "professional"
    },
    {
      icon: Coffee,
      title: "Work-Life Balance",
      description: "Unlimited PTO, mental health support, and wellness programs",
      category: "work-life"
    }
  ]

  const officeLocations: OfficeLocation[] = [
    {
      city: "New York",
      country: "United States",
      type: "headquarters",
      employeeCount: 150,
      image: "/api/placeholder/400/300"
    },
    {
      city: "San Francisco",
      country: "United States",
      type: "office",
      employeeCount: 85,
      image: "/api/placeholder/400/300"
    },
    {
      city: "London",
      country: "United Kingdom",
      type: "office",
      employeeCount: 60,
      image: "/api/placeholder/400/300"
    },
    {
      city: "Berlin",
      country: "Germany",
      type: "office",
      employeeCount: 45,
      image: "/api/placeholder/400/300"
    }
  ]

  const departments = [
    { id: "all", label: "All Departments" },
    { id: "Engineering", label: "Engineering" },
    { id: "Product", label: "Product" },
    { id: "Design", label: "Design" },
    { id: "Marketing", label: "Marketing" },
    { id: "Customer Success", label: "Customer Success" },
    { id: "Data & Analytics", label: "Data & Analytics" },
    { id: "Operations", label: "Operations" }
  ]

  const locations = [
    { id: "all", label: "All Locations" },
    { id: "Remote", label: "Remote" },
    { id: "New York", label: "New York, NY" },
    { id: "San Francisco", label: "San Francisco, CA" },
    { id: "Boston", label: "Boston, MA" },
    { id: "Los Angeles", label: "Los Angeles, CA" },
    { id: "London", label: "London, UK" }
  ]

  const jobTypes = [
    { id: "all", label: "All Types" },
    { id: "full-time", label: "Full-time" },
    { id: "part-time", label: "Part-time" },
    { id: "contract", label: "Contract" },
    { id: "internship", label: "Internship" }
  ]

  const featuredJobs = jobOpenings.filter(job => job.featured).slice(0, 3)

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-accent-primary/10 text-blue-800'
      case 'part-time': return 'bg-semantic-success/10 text-green-800'
      case 'contract': return 'bg-accent-primary/10 text-purple-800'
      case 'internship': return 'bg-semantic-warning/10 text-orange-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'entry': return 'bg-neutral-100 text-neutral-800'
      case 'mid': return 'bg-accent-primary/10 text-blue-800'
      case 'senior': return 'bg-accent-primary/10 text-purple-800'
      case 'lead': return 'bg-semantic-warning/10 text-orange-800'
      case 'executive': return 'bg-semantic-error/10 text-red-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3 mx-auto"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary/20 rounded-full mb-6">
              <Briefcase className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Shape the Future of Travel
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join a team of passionate innovators, explorers, and creators building the next generation
              of travel experiences. We&apos;re looking for talented individuals ready to make an impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Search className="h-5 w-5 mr-2"/>
                Explore Openings
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Users className="h-5 w-5 mr-2"/>
                Meet Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Job Search & Filters */}
      <section className="py-12 px-4 bg-muted/30 border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-background rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Find Your Role</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"/>
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Department"/>
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location"/>
                </SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type"/>
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found</span>
              <Button variant="ghost" size="sm" onClick={() => {
                setSearchQuery("")
                setSelectedDepartment("all")
                setSelectedLocation("all")
                setSelectedType("all")
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Featured Opportunities</h2>
            <p className="text-lg text-muted-foreground">
              Our most exciting roles that are shaping the future of travel
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getJobTypeColor(job.type)}>
                      {job.type.replace('-', ' ')}
                    </Badge>
                    {job.urgent && (
                      <Badge variant="destructive">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{job.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Building2 className="h-4 w-4 mr-1"/>
                    {job.department}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1"/>
                    {job.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {job.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-muted-foreground">
                      {job.salary}
                    </div>
                    <Badge className={getLevelColor(job.level)}>
                      {job.level}
                    </Badge>
                  </div>
                  <Button className="w-full">
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2"/>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/careers/openings">
                <Briefcase className="h-5 w-5 mr-2"/>
                View All Openings ({jobOpenings.length})
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Company Values & Culture */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Our Culture & Values</h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyValues.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className={`text-4xl mb-4 w-16 h-16 mx-auto rounded-full flex items-center justify-center ${value.color}`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Perks */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Benefits & Perks</h2>
            <p className="text-lg text-muted-foreground">
              We offer competitive benefits to support your well-being and growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employeeBenefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <benefit.icon className="h-8 w-8 text-accent-primary"/>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Our Locations</h2>
            <p className="text-lg text-muted-foreground">
              Join teams around the world, or work remotely from anywhere
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {officeLocations.map((location, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-background/90 text-foreground">
                      {location.type === 'headquarters' ? 'HQ' : location.type}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-background/90 rounded px-2 py-1">
                      <span className="text-sm font-medium">{location.employeeCount} employees</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{location.city}</h3>
                  <p className="text-muted-foreground mb-4">{location.country}</p>
                  <Button variant="outline" className="w-full">
                    Learn About Life Here
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <Globe className="h-12 w-12 mx-auto mb-4 text-accent-primary"/>
                <h3 className="text-lg font-semibold mb-2">Remote Work</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Many of our roles offer fully remote work options, allowing you to work from anywhere in the world.
                </p>
                <Badge className="bg-semantic-success/10 text-green-800">
                  Available for most positions
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Career Resources */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Career Resources</h2>
            <p className="text-lg text-muted-foreground">
              Learn more about working at ATLVS + GVTEWAY
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="pt-8 pb-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-accent-primary"/>
                <h3 className="text-lg font-semibold mb-3">Our Culture</h3>
                <p className="text-muted-foreground mb-4">
                  Learn about our values, mission, and team dynamics
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/careers/culture">Explore Culture</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="pt-8 pb-6 text-center">
                <Award className="h-12 w-12 mx-auto mb-4 text-accent-primary"/>
                <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive benefits and perks for our team
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/careers/benefits">View Benefits</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="pt-8 pb-6 text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-accent-primary"/>
                <h3 className="text-lg font-semibold mb-3">Locations</h3>
                <p className="text-muted-foreground mb-4">
                  Our offices and remote work opportunities
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/careers/locations">View Locations</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="pt-8 pb-6 text-center">
                <Zap className="h-12 w-12 mx-auto mb-4 text-accent-primary"/>
                <h3 className="text-lg font-semibold mb-3">Internships</h3>
                <p className="text-muted-foreground mb-4">
                  Launch your career with our internship programs
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/careers/internships">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Briefcase className="h-16 w-16 mx-auto mb-6 text-accent-primary"/>
          <h2 className="text-4xl font-display font-bold mb-4">Ready to Join Our Team?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We&apos;re always looking for talented individuals who are passionate about travel,
            innovation, and creating exceptional experiences. Let&apos;s build something extraordinary together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/careers/openings">
                <Search className="h-5 w-5 mr-2"/>
                Browse Open Positions
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/careers/events">
                <Users className="h-5 w-5 mr-2"/>
                Attend Hiring Events
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Careers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
