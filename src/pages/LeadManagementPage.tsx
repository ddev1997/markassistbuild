import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LeadCard, Lead } from '@/components/leads/LeadCard';
import { LeadTable } from '@/components/leads/LeadTable';
import { Chatbot } from '@/components/chatbot/Chatbot';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Users, 
  Grid3X3, 
  List, 
  Target, 
  Download, 
  MessageCircle,
  RefreshCw,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeadManagementPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isLoading, setIsLoading] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load leads from localStorage
    const storedLeads = localStorage.getItem('generatedLeads');
    if (storedLeads) {
      try {
        const parsedLeads = JSON.parse(storedLeads);
        setLeads(parsedLeads);
      } catch (error) {
        console.error('Error parsing stored leads:', error);
      }
    }
  }, []);

  const handleSelectLead = (companyName: string, selected: boolean) => {
    const newSelection = new Set(selectedLeads);
    if (selected) {
      newSelection.add(companyName);
    } else {
      newSelection.delete(companyName);
    }
    setSelectedLeads(newSelection);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedLeads(new Set(leads.map(lead => lead.company_name)));
    } else {
      setSelectedLeads(new Set());
    }
  };

  const handleEnrichment = async () => {
    if (selectedLeads.size === 0) {
      toast({
        title: "No leads selected",
        description: "Please select at least one lead to enrich",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const queryId = localStorage.getItem('queryId') || 'default_query';
      const selectedLeadData = leads.filter(lead => selectedLeads.has(lead.company_name));
      
      const updates = selectedLeadData.map(lead => ({
        company_name: lead.company_name,
        linkedin_profiles: Object.values(lead.linkedin_profiles).filter(url => url && url.trim() !== '')
      }));

      const response = await fetch('https://my-fastapi-service-608954479960.us-central1.run.app/update_linkedin_profiles_with_lusha_bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query_id: queryId,
          updates
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enrich leads');
      }

      const data = await response.json();
      
      // Store enriched leads and redirect to enrichment page
      localStorage.setItem('enrichedLeads', JSON.stringify(data.leads));
      
      toast({
        title: "Success!",
        description: `Enriched ${data.leads.length} leads with detailed contact information`,
      });

      navigate('/dashboard/lead-enrichment');
    } catch (error) {
      toast({
        title: "Enrichment Failed",
        description: error instanceof Error ? error.message : "Failed to enrich leads",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (format: 'csv' | 'excel') => {
    const leadsToExport = selectedLeads.size > 0 
      ? leads.filter(lead => selectedLeads.has(lead.company_name))
      : leads;

    if (leadsToExport.length === 0) {
      toast({
        title: "No data to export",
        description: "Please select leads or generate some leads first",
        variant: "destructive",
      });
      return;
    }

    // Convert leads to CSV format
    const headers = ['Company Name', 'URL', 'Revenue', 'Company Size', 'Score', 'Target Personas', 'Why Company Fit'];
    const csvData = leadsToExport.map(lead => [
      lead.company_name,
      lead.url,
      lead.revenue,
      lead.company_size,
      lead.score.toString(),
      lead.target_persona.join('; '),
      lead.why_company_fit.replace(/,/g, ';') // Replace commas to avoid CSV issues
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export.${format === 'csv' ? 'csv' : 'xlsx'}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Downloaded ${leadsToExport.length} leads as ${format.toUpperCase()}`,
    });
  };

  if (isLoading) {
    return <LoadingSpinner message="Enriching your leads..." />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lead Management</h1>
            <p className="text-muted-foreground">
              Manage and organize your generated leads
            </p>
          </div>
          
          <Button
            onClick={() => setShowChatbot(true)}
            className="btn-futuristic"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            AI Assistant
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{leads.length}</p>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{selectedLeads.size}</p>
                  <p className="text-sm text-muted-foreground">Selected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {leads.filter(lead => lead.enrichemnt === "true").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Enriched</p>
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
                    {leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length) : 0}
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
                <Button
                  onClick={handleEnrichment}
                  disabled={selectedLeads.size === 0}
                  className="btn-futuristic"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Enrich Selected ({selectedLeads.size})
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleExport('csv')}
                  size="sm"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleExport('excel')}
                  size="sm"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads Display */}
        {leads.length === 0 ? (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>No Leads Found</CardTitle>
              <CardDescription>
                Generate some leads first to see them here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/dashboard/lead-generation')}>
                Generate Leads
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {leads.map((lead) => (
                  <LeadCard
                    key={lead.company_name}
                    lead={lead}
                    isSelected={selectedLeads.has(lead.company_name)}
                    onSelect={(selected) => handleSelectLead(lead.company_name, selected)}
                    showSelection={true}
                    showEnrichmentButton={false}
                  />
                ))}
              </div>
            ) : (
              <LeadTable
                leads={leads}
                selectedLeads={selectedLeads}
                onSelectLead={handleSelectLead}
                onSelectAll={handleSelectAll}
                showSelection={true}
                showEnrichmentButton={false}
              />
            )}
          </>
        )}

        {/* Chatbot */}
        {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
      </div>
    </DashboardLayout>
  );
};

export default LeadManagementPage;