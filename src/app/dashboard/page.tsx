'use client'

import { RouteGuard } from '@/components/auth/route-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Wifi, Gamepad2, Users, History, Bug, ArrowRight } from 'lucide-react'

const dashboardCards = [
  {
    title: 'All Toys',
    description: 'Manage all registered toys in the system',
    icon: Wifi,
    href: '/dashboard/toys',
    color: 'bg-blue-500'
  },
  {
    title: 'Activated Toys',
    description: 'View and manage activated toy profiles',
    icon: Gamepad2,
    href: '/dashboard/activated-toys',
    color: 'bg-green-500'
  },
  {
    title: 'Parent Profiles',
    description: 'Manage parent user profiles',
    icon: Users,
    href: '/dashboard/parents',
    color: 'bg-purple-500'
  },
  {
    title: 'Login History',
    description: 'Monitor user login activity',
    icon: History,
    href: '/dashboard/login-history',
    color: 'bg-orange-500'
  },
  {
    title: 'Bug Reports',
    description: 'Track and manage reported bugs',
    icon: Bug,
    href: '/dashboard/bugs',
    color: 'bg-red-500'
  }
]

export default function DashboardPage() {
  const router = useRouter()

  return (
    <RouteGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-2">
              Welcome to the Cheeko AI Admin Dashboard. Select a section to manage.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card) => (
              <Card key={card.href} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${card.color} text-white`}>
                      <card.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm">
                    {card.description}
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(card.href)}
                    className="w-full justify-between"
                  >
                    Manage
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>System overview at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">-</div>
                  <div className="text-sm text-muted-foreground">Total Toys</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">-</div>
                  <div className="text-sm text-muted-foreground">Active Toys</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">-</div>
                  <div className="text-sm text-muted-foreground">Parents</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">-</div>
                  <div className="text-sm text-muted-foreground">Open Bugs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </RouteGuard>
  )
}