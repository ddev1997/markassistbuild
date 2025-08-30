import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LeadCard, Lead } from '@/components/leads/LeadCard';
import { LeadTable } from '@/components/leads/LeadTable';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Target, 
  Grid3X3, 
  List, 
  Eye, 
  Mail, 
  Phone,
  Download,
  RefreshCw
} from 'lucide-react';

const LeadEnrichmentPage: React.FC = () => {
  const [enrichedLeads, setEnrichedLeads] = useState<Lead[]>([]);
  const [allEnrichedLeads, setAllEnrichedLeads] = useState<Lead[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isLoading, setIsLoading] = useState(false);
  const [showAllEnriched, setShowAllEnriched] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load enriched leads from localStorage
    const storedEnrichedLeads = localStorage.getItem('enrichedLeads');
    if (storedEnrichedLeads) {
      try {
        const parsedLeads = JSON.parse(storedEnrichedLeads);
        setEnrichedLeads(parsedLeads);
      } catch (error) {
        console.error('Error parsing stored enriched leads:', error);
      }
    }
  }, []);

  const handleEnrichmentPreview = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://my-fastapi-service-608954479960.us-central1.run.app/find_all_enrichemnt_value', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch enrichment preview');
      }

      const data = await response.json();
      setAllEnrichedLeads(data);
      setShowAllEnriched(true);
      
      toast({
        title: "Preview Loaded",
        description: `Displaying ${data.length} enriched leads`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load enrichment preview",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (format: 'csv' | 'excel') => {
    const leadsToExport = showAllEnriched ? allEnrichedLeads : enrichedLeads;

    if (leadsToExport.length === 0) {
      toast({
        title: "No data to export",
        description: "No enriched leads available for export",
        variant: "destructive",
      });
      return;
    }

    // Enhanced CSV export with enriched data
    const headers = [
      'Company Name', 'URL', 'Revenue', 'Company Size', 'Score', 'Target Personas', 
      'Why Company Fit', 'Emails', 'Phones', 'LinkedIn Profiles'
    ];
    
    const csvData = leadsToExport.map(lead => [
      lead.company_name,
      lead.url,
      lead.revenue,
      lead.company_size,
      lead.score.toString(),
      lead.target_persona.join('; '),
      lead.why_company_fit.replace(/,/g, ';'),
      lead.emails ? lead.emails.map(e => `${e.email} (${e.emailType})`).join('; ') : '',
      lead.phones ? lead.phones.map(p => `${p.number} (${p.phoneType})`).join('; ') : '',
      Object.entries(lead.linkedin_profiles).map(([role, url]) => `${role}: ${url}`).join('; ')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `enriched_leads_export.${format === 'csv' ? 'csv' : 'xlsx'}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Downloaded ${leadsToExport.length} enriched leads as ${format.toUpperCase()}`,
    });
  };

  const currentLeads = showAllEnriched ? allEnrichedLeads : enrichedLeads;
  const totalEmails = currentLeads.reduce((sum, lead) => sum + (lead.emails?.length || 0), 0);
  const totalPhones = currentLeads.reduce((sum, lead) => sum + (lead.phones?.length || 0), 0);

  if (isLoading) {
    return <LoadingSpinner message="Loading enrichment preview..." />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lead Enrichment</h1>
            <p className="text-muted-foreground">
              View and manage your enriched lead data with contact information
            </p>
          </div>
          
          <Button
            onClick={handleEnrichmentPreview}
            className="btn-futuristic"
          >
            <Eye className="w-4 h-4 mr-2" />
            Enrichment Preview
          </Button>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{currentLeads.length}</p>
                  <p className="text-sm text-muted-foreground">Enriched Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalEmails}</p>
                  <p className="text-sm text-muted-foreground">Email Contacts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalPhones}</p>
                  <p className="text-sm text-muted-foreground">Phone Contacts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {currentLeads.filter(lead => lead.enrichemnt === "true").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Fully Enriched</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">%</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {currentLeads.length > 0 ? Math.round(currentLeads.reduce((sum, lead) => sum + lead.score, 0) / currentLeads.length) : 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  onClick={() => setViewMode('cards')}
                  size="sm"
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Cards
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  onClick={() => setViewMode('table')}
                  size="sm"
                >
                  <List className="w-4 h-4 mr-2" />
                  Table
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {showAllEnriched && (
                  <Button
                    variant="outline"
                    onClick={() => setShowAllEnriched(false)}
                    size="sm"
                  >
                    Show Recent Only
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => handleExport('csv')}
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleExport('excel')}
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enriched Leads Display */}
        {currentLeads.length === 0 ? (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>No Enriched Leads Found</CardTitle>
              <CardDescription>
                {showAllEnriched 
                  ? "No enriched leads available in the system"
                  : "Enrich some leads first to see detailed contact information here"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Data Source Indicator */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-xl">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {showAllEnriched ? "Showing all enriched leads" : "Showing recently enriched leads"}
                </span>
              </div>
            </div>

            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentLeads.map((lead) => (
                  <LeadCard
                    key={`${lead.company_name}-${lead.timestamp || Date.now()}`}
                    lead={lead}
                    showSelection={false}
                    showEnrichmentButton={false}
                  />
                ))}
              </div>
            ) : (
              <LeadTable
                leads={currentLeads}
                showSelection={false}
                showEnrichmentButton={false}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LeadEnrichmentPage;