import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Target, TrendingUp, ArrowRight, Zap } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Generate New Leads",
      description: "Find your next customers with AI-powered lead generation",
      icon: Search,
      action: () => navigate('/dashboard/lead-generation'),
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Manage Leads",
      description: "View and organize your existing lead database",
      icon: Users,
      action: () => navigate('/dashboard/lead-management'),
      color: "from-green-500 to-green-600",
    },
    {
      title: "Enrich Data",
      description: "Enhance your leads with detailed contact information",
      icon: Target,
      action: () => navigate('/dashboard/lead-enrichment'),
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Analyze Competition",
      description: "Get insights into your competitors' strategies",
      icon: TrendingUp,
      action: () => navigate('/dashboard/competitor-analysis'),
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-primary-glow rounded-2xl text-white shadow-glow">
            <Zap className="w-6 h-6" />
            <h1 className="text-2xl font-bold">AI-Powered Lead Generation Dashboard</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your business with intelligent lead discovery, enrichment, and management tools.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => (
            <Card 
              key={action.title} 
              className="glass-card hover:scale-105 transition-spring cursor-pointer group"
              onClick={action.action}
            >
              <CardHeader className="space-y-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-md`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="flex items-center justify-between group-hover:text-primary transition-colors">
                    {action.title}
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </CardTitle>
                  <CardDescription className="mt-2">{action.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-primary">2,847</CardTitle>
              <CardDescription>Total Leads Generated</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-green-600">76%</CardTitle>
              <CardDescription>Lead Quality Score</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-purple-600">24%</CardTitle>
              <CardDescription>Conversion Rate</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Start */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>
              Get started with MarkAssist in just a few steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-primary-light rounded-xl">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold">Generate Your First Leads</h3>
                <p className="text-sm text-muted-foreground">Describe your target market and let AI find perfect prospects</p>
              </div>
              <Button 
                onClick={() => navigate('/dashboard/lead-generation')}
                className="btn-futuristic ml-auto"
              >
                Start Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;