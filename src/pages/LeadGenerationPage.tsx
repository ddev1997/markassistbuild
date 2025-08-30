import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Search, Sparkles, Target, TrendingUp } from 'lucide-react';

const LeadGenerationPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const suggestions = [
    "AI tool for financial data analysis in US banks",
    "CRM software for healthcare institutions",
    "HR management system for tech companies",
    "Marketing automation platform for e-commerce",
    "Project management tool for consulting firms",
    "Customer support software for SaaS companies"
  ];

  const handleGenerateLeads = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please describe your target market",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://my-fastapi-service-608954479960.us-central1.run.app/lead_gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate leads');
      }

      const data = await response.json();
      
      // Store the generated leads in localStorage for the management page
      localStorage.setItem('generatedLeads', JSON.stringify(data.leads));
      localStorage.setItem('queryId', data.query_id);
      
      toast({
        title: "Success!",
        description: `Generated ${data.leads.length} high-quality leads`,
      });

      // Redirect to lead management with the new data
      navigate('/dashboard/lead-management');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate leads",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Finding perfect leads for you..." />;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-primary-glow rounded-2xl text-white shadow-glow">
            <Search className="w-6 h-6" />
            <h1 className="text-2xl font-bold">AI Lead Generation</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Describe your ideal customer or product, and our AI will find companies that perfectly match your criteria.
          </p>
        </div>

        {/* Main Form */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Target Market Description
            </CardTitle>
            <CardDescription>
              Be specific about your product, target industry, company size, or any other criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="content">Describe your target market</Label>
              <Input
                id="content"
                placeholder="e.g., AI tool for financial data analysis in US banks"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-14 text-lg"
              />
            </div>

            <Button 
              onClick={handleGenerateLeads}
              className="w-full btn-futuristic h-14 text-lg"
              disabled={!content.trim()}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              FindLeadWithMarkAssist
            </Button>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Popular Searches
            </CardTitle>
            <CardDescription>
              Click on any suggestion to get started quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto p-4 hover:bg-primary/5 hover:border-primary transition-colors"
                  onClick={() => setContent(suggestion)}
                >
                  <div className="text-sm">
                    <div className="font-medium text-foreground">{suggestion}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mx-auto flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">AI-Powered Matching</h3>
              <p className="text-sm text-muted-foreground">
                Advanced algorithms find companies that perfectly match your criteria
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mx-auto flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">High-Quality Leads</h3>
              <p className="text-sm text-muted-foreground">
                Every lead comes with detailed company info and decision-maker contacts
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mx-auto flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Real-Time Data</h3>
              <p className="text-sm text-muted-foreground">
                Up-to-date company information and accurate contact details
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeadGenerationPage;