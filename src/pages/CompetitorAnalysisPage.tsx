import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart, Users, Target } from 'lucide-react';

const CompetitorAnalysisPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl text-white shadow-glow">
            <TrendingUp className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Competitor Analysis</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Analyze your competitors and discover market opportunities
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="glass-card max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Coming Soon</CardTitle>
            <CardDescription className="text-center">
              Advanced competitor analysis features are being developed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mx-auto flex items-center justify-center">
                  <BarChart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">Market Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Deep insights into market trends and competitor positioning
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mx-auto flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">Competitor Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor competitor activities and strategy changes
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mx-auto flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">Opportunity Mapping</h3>
                <p className="text-sm text-muted-foreground">
                  Identify gaps and opportunities in the market
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl mx-auto flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">Performance Benchmarks</h3>
                <p className="text-sm text-muted-foreground">
                  Compare your performance against industry leaders
                </p>
              </div>
            </div>

            <div className="text-center bg-primary-light p-4 rounded-xl">
              <p className="text-sm text-foreground">
                This feature is currently in development. Stay tuned for powerful competitor analysis tools that will help you stay ahead of the competition.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CompetitorAnalysisPage;