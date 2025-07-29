'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { 
  Gamepad2, 
  Users, 
  History, 
  Bug, 
  LogOut, 
  UserCheck,
  Wifi
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  {
    title: 'All Toys',
    icon: Wifi,
    href: '/dashboard/toys'
  },
  {
    title: 'Activated Toys', 
    icon: Gamepad2,
    href: '/dashboard/activated-toys'
  },
  {
    title: 'Parent Profiles',
    icon: Users,
    href: '/dashboard/parents'
  },
  {
    title: 'Login History',
    icon: History,
    href: '/dashboard/login-history'
  },
  {
    title: 'Bug Reports',
    icon: Bug,
    href: '/dashboard/bugs'
  }
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-4 py-4">
              <Gamepad2 className="h-6 w-6" />
              <span className="font-semibold text-lg">Cheeko AI</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    onClick={() => handleNavigation(item.href)}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <div className="mt-auto border-t border-sidebar-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b bg-background px-6 py-3">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}