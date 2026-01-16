
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/lib/design-system'
import { Trophy, Target, Calendar, TrendingUp, Users, Award, Plus, Play } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'

interface FitnessStats {
  currentStreak: number
  totalWorkouts: number
  totalMinutes: number
  currentGoals: number
  completedGoals: number
  rank: number
  totalMembers: number
}

interface Challenge {
  id: string
  name: string
  description: string
  progress: number
  days_left: number
  participants: number
  reward: string
}

interface Workout {
  id: string
  name: string
  date: string
  duration: number
  calories: number
  type: string
}

interface FitnessGoal {
  id: string
  name: string
  progress: number
  target: number
  current: number
  unit: string
  deadline: string
}

export default function FitnessPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [fitnessStats, setFitnessStats] = useState<FitnessStats>({
    currentStreak: 0,
    totalWorkouts: 0,
    totalMinutes: 0,
    currentGoals: 0,
    completedGoals: 0,
    rank: 0,
    totalMembers: 0
  })
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([])
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([])
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch fitness data from Supabase
  useEffect(() => {
    const fetchFitnessData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const supabase = createClient()
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          // User not authenticated - show empty state
          setIsLoading(false)
          return
        }

        // Fetch user's activities to calculate stats
        const { data: activities, error: activitiesError } = await supabase
          .from('activities')
          .select('id, action, entity, details, "createdAt"')
          .eq('user_id', user.id)
          .eq('entity', 'workout')
          .order('"createdAt"', { ascending: false })
          .limit(50)

        if (activitiesError) {
          logger.error('Failed to fetch fitness activities', activitiesError, { userId: user.id })
        }

        // Calculate fitness stats from activities
        const workoutActivities = activities || []
        const totalWorkouts = workoutActivities.length
        const totalMinutes = workoutActivities.reduce((sum, a) => {
          const details = a.details as { duration?: number } | null
          return sum + (details?.duration || 0)
        }, 0)

        // Get total platform users for ranking context
        const { count: totalUsers } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })

        setFitnessStats({
          currentStreak: 0, // Would need date-based calculation
          totalWorkouts,
          totalMinutes,
          currentGoals: 0,
          completedGoals: 0,
          rank: 0,
          totalMembers: totalUsers || 0
        })

        // Map activities to workout format
        const mappedWorkouts: Workout[] = workoutActivities.slice(0, 10).map(a => {
          const details = a.details as { name?: string; duration?: number; calories?: number; type?: string } | null
          return {
            id: a.id,
            name: details?.name || 'Workout',
            date: a.createdAt,
            duration: details?.duration || 0,
            calories: details?.calories || 0,
            type: details?.type || 'general'
          }
        })

        setRecentWorkouts(mappedWorkouts)
        setActiveChallenges([])
        setFitnessGoals([])
        
      } catch (err) {
        logger.error('Failed to fetch fitness data', err)
        setError('Failed to load fitness data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchFitnessData()
  }, [])

  // Leaderboard would be fetched from API
  const [leaderboard, setLeaderboard] = useState<{ rank: number; name: string; points: number; avatar: string; isCurrentUser?: boolean }[]>([])

  const achievements = [
    { id: 1, name: "First Workout", description: "Completed your first workout", icon: "", unlocked: true },
    { id: 2, name: "Week Warrior", description: "7 consecutive days of workouts", icon: "", unlocked: true },
    { id: 3, name: "Consistency King", description: "30 days of consistent activity", icon: "", unlocked: true },
    { id: 4, name: "Century Club", description: "100 total workouts completed", icon: "", unlocked: false },
    { id: 5, name: "Marathon Master", description: "Run a full marathon", icon: "", unlocked: false }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-display font-bold">FAT Club Fitness</h1>
              <p className="text-muted-foreground">
                Track your progress, join challenges, and stay motivated with our fitness community
              </p>
            </div>
            <Button>
              <Play className="h-4 w-4 mr-2"/>
              Start Workout
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-display text-accent-primary flex items-center">
                    <Trophy className="h-5 w-5 mr-2"/>
                    {fitnessStats.currentStreak}
                  </CardTitle>
                  <CardDescription>Day Streak</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Keep it up! 
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-display text-accent-secondary flex items-center">
                    <Target className="h-5 w-5 mr-2"/>
                    {fitnessStats.totalWorkouts}
                  </CardTitle>
                  <CardDescription>Total Workouts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {fitnessStats.totalMinutes} minutes total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-display text-accent-tertiary flex items-center">
                    <Calendar className="h-5 w-5 mr-2"/>
                    {fitnessStats.currentGoals}
                  </CardTitle>
                  <CardDescription>Active Goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {fitnessStats.completedGoals} completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-display text-success flex items-center">
                    <Users className="h-5 w-5 mr-2"/>
                    #{fitnessStats.rank}
                  </CardTitle>
                  <CardDescription>Community Rank</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    of {fitnessStats.totalMembers.toLocaleString()} members
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Goals Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2"/>
                  Your Fitness Goals
                </CardTitle>
                <CardDescription>Track your progress towards personal milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {fitnessGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{goal.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {goal.current}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2"/>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{goal.progress}% complete</span>
                      <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2"/>
                  Add New Goal
                </Button>
              </CardContent>
            </Card>

            {/* Recent Workouts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2"/>
                  Recent Workouts
                </CardTitle>
                <CardDescription>Your latest fitness activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentWorkouts.map((workout) => (
                    <div key={workout.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-accent-primary">
                            {workout.type.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{workout.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(workout.date).toLocaleDateString()} • {workout.duration} min
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{workout.calories} cal</p>
                        <Badge variant="outline" className="text-xs">
                          {workout.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                <h3 className="text-lg font-semibold mb-2">Workout Library</h3>
                <p className="text-muted-foreground mb-4">
                  Access hundreds of guided workouts tailored to your fitness level and goals
                </p>
                <Button>
                  <Play className="h-4 w-4 mr-2"/>
                  Browse Workouts
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            {/* Active Challenges */}
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold">Active Challenges</h2>
              {activeChallenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{challenge.name}</CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{challenge.days_left} days left</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2"/>
                    </div>

                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                      <span>{challenge.participants.toLocaleString()} participants</span>
                      <span>Reward: {challenge.reward}</span>
                    </div>

                    <Button className="w-full">
                      Continue Challenge
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Community Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2"/>
                  Community Leaderboard
                </CardTitle>
                <CardDescription>Top performers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user, index) => (
                    <div key={user.rank} className={`flex items-center justify-between p-3 rounded-lg ${
                      user.isCurrentUser ? 'bg-accent-primary/10 border border-accent-primary/20' : 'bg-muted/50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-semantic-warning/10 text-yellow-800' :
                          index === 1 ? 'bg-neutral-100 text-neutral-800' :
                          index === 2 ? 'bg-semantic-warning/10 text-orange-800' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {user.rank}
                        </div>
                        <div className="w-8 h-8 bg-accent-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold">{user.avatar}</span>
                        </div>
                        <span className={`font-medium ${user.isCurrentUser ? 'text-accent-primary' : ''}`}>
                          {user.name}
                        </span>
                        {user.isCurrentUser && <Badge variant="secondary" className="text-xs">You</Badge>}
                      </div>
                      <span className="font-bold text-accent-primary">{user.points.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={achievement.unlocked ? 'border-accent-primary/20' : 'opacity-60'}>
                  <CardContent className="pt-6 text-center">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl ${
                      achievement.unlocked ? 'bg-accent-primary/10' : 'bg-muted'
                    }`}>
                      {achievement.unlocked ? achievement.icon : ''}
                    </div>
                    <h3 className="font-semibold mb-2">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {achievement.description}
                    </p>
                    {achievement.unlocked ? (
                      <Badge variant="secondary" className="text-xs">
                        <Award className="h-3 w-3 mr-1"/>
                        Unlocked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Locked
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
