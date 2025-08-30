import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  Search, 
  Users, 
  Target, 
  TrendingUp, 
  Zap,
  Database
} from 'lucide-react';

const menuItems = [
  {
    title: "Lead Generation",
    url: "/dashboard/lead-generation",
    icon: Search,
  },
  {
    title: "Lead Management",
    url: "/dashboard/lead-management",
    icon: Users,
  },
  {
    title: "Lead Enrichment",
    url: "/dashboard/lead-enrichment",
    icon: Target,
  },
  {
    title: "Competitor Analysis",
    url: "/dashboard/competitor-analysis",
    icon: TrendingUp,
  },
];

export const DashboardSidebar: React.FC = () => {
  const { state } = useSidebar();
  const { isOutOfCredits } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-semibold shadow-md" 
      : "hover:bg-primary/10 hover:text-primary text-foreground";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-white/95 backdrop-blur-lg border-r border-primary/10">
        {/* Logo Section */}
        <div className="p-6 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-glow rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-foreground">MarkAssist</h2>
                <p className="text-xs text-muted-foreground">AI Platform</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">
            {!isCollapsed ? "Main Menu" : ""}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={isOutOfCredits ? "#" : item.url} 
                      end 
                      className={({ isActive }) => 
                        isOutOfCredits 
                          ? "opacity-50 cursor-not-allowed text-muted-foreground" 
                          : getNavCls({ isActive })
                      }
                      onClick={(e) => {
                        if (isOutOfCredits) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <item.icon className="w-5 h-5" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats */}
        {!isCollapsed && (
          <div className="p-4 mt-auto">
            <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Quick Stats</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Active Campaigns: 12</div>
                <div>Total Leads: 2,847</div>
                <div>Conversion Rate: 24%</div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;