import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ExternalLink, Mail, Phone, Star, Users, DollarSign } from 'lucide-react';

export interface Lead {
  company_name: string;
  url: string;
  revenue: string;
  company_size: string;
  why_company_fit: string;
  target_persona: string[];
  score: number;
  enrichemnt: string;
  linkedin_profiles: Record<string, string>;
  emails?: Array<{
    email: string;
    emailType: string;
    updateDate: string;
    emailConfidence: string;
  }>;
  phones?: Array<{
    number: string;
    phoneType: string;
    doNotCall: boolean;
    updateDate: string;
  }>;
  timestamp?: string;
}

interface LeadCardProps {
  lead: Lead;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  showEnrichmentButton?: boolean;
  onEnrich?: () => void;
  showSelection?: boolean;
}

export const LeadCard: React.FC<LeadCardProps> = ({ 
  lead, 
  isSelected = false, 
  onSelect, 
  showEnrichmentButton = false,
  onEnrich,
  showSelection = false
}) => {
  const isEnriched = lead.enrichemnt === "true";

  return (
    <Card className={`glass-card transition-all duration-300 hover:shadow-card ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {showSelection && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={onSelect}
                className="mt-1"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg font-bold text-foreground">
                  {lead.company_name}
                </CardTitle>
                <Badge variant={isEnriched ? "default" : "secondary"} className="text-xs">
                  {isEnriched ? "Enriched" : "Basic"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="w-4 h-4" />
                <a 
                  href={lead.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {lead.url}
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-lg">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">{lead.score}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Company Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="font-medium">{lead.revenue}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Company Size</p>
              <p className="font-medium">{lead.company_size}</p>
            </div>
          </div>
        </div>

        {/* Target Personas */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Target Personas</p>
          <div className="flex flex-wrap gap-2">
            {lead.target_persona.map((persona, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {persona}
              </Badge>
            ))}
          </div>
        </div>

        {/* LinkedIn Profiles */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">LinkedIn Profiles</p>
          <div className="space-y-2">
            {Object.entries(lead.linkedin_profiles).map(([role, url]) => (
              <div key={role} className="flex items-center justify-between p-2 bg-primary-light rounded-lg">
                <span className="text-sm font-medium">{role}</span>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-glow transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Enriched Data */}
        {isEnriched && (
          <>
            {lead.emails && lead.emails.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Email Contacts</p>
                <div className="space-y-2">
                  {lead.emails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <Mail className="w-4 h-4 text-green-500" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{email.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {email.emailType} • Confidence: {email.emailConfidence}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lead.phones && lead.phones.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Phone Contacts</p>
                <div className="space-y-2">
                  {lead.phones.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <Phone className="w-4 h-4 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{phone.number}</p>
                        <p className="text-xs text-muted-foreground">
                          {phone.phoneType} • {phone.doNotCall ? 'Do Not Call' : 'Can Call'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Why Company Fit */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Why This Company Fits</p>
          <p className="text-sm bg-accent/50 p-3 rounded-lg">{lead.why_company_fit}</p>
        </div>

        {/* Action Buttons */}
        {showEnrichmentButton && !isEnriched && (
          <Button 
            onClick={onEnrich}
            className="w-full btn-futuristic"
          >
            Enrich Lead Data
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadCard;