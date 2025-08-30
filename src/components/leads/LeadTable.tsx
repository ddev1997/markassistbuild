import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ExternalLink, Star, Mail, Phone } from 'lucide-react';
import { Lead } from './LeadCard';

interface LeadTableProps {
  leads: Lead[];
  selectedLeads?: Set<string>;
  onSelectLead?: (companyName: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  showEnrichmentButton?: boolean;
  onEnrich?: (lead: Lead) => void;
  showSelection?: boolean;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  selectedLeads = new Set(),
  onSelectLead,
  onSelectAll,
  showEnrichmentButton = false,
  onEnrich,
  showSelection = false
}) => {
  const allSelected = leads.length > 0 && leads.every(lead => selectedLeads.has(lead.company_name));
  const someSelected = leads.some(lead => selectedLeads.has(lead.company_name));

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/5">
            {showSelection && (
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected || (someSelected && !allSelected) ? true : false}
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
            )}
            <TableHead className="font-semibold">Company</TableHead>
            <TableHead className="font-semibold">Score</TableHead>
            <TableHead className="font-semibold">Revenue</TableHead>
            <TableHead className="font-semibold">Size</TableHead>
            <TableHead className="font-semibold">Target Personas</TableHead>
            <TableHead className="font-semibold">LinkedIn</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Contact Info</TableHead>
            {showEnrichmentButton && <TableHead className="font-semibold">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => {
            const isSelected = selectedLeads.has(lead.company_name);
            const isEnriched = lead.enrichemnt === "true";
            
            return (
              <TableRow 
                key={lead.company_name} 
                className={`hover:bg-primary/5 transition-colors ${isSelected ? 'bg-primary/10' : ''}`}
              >
                {showSelection && (
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => 
                        onSelectLead?.(lead.company_name, checked as boolean)
                      }
                    />
                  </TableCell>
                )}
                
                <TableCell>
                  <div>
                    <div className="font-semibold text-foreground">{lead.company_name}</div>
                    <a 
                      href={lead.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary-glow flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Visit Website
                    </a>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-primary">{lead.score}</span>
                  </div>
                </TableCell>
                
                <TableCell className="text-sm">{lead.revenue}</TableCell>
                
                <TableCell className="text-sm">{lead.company_size}</TableCell>
                
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {lead.target_persona.map((persona, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {persona}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    {Object.entries(lead.linkedin_profiles).map(([role, url]) => (
                      <a 
                        key={role}
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-xs text-primary hover:text-primary-glow"
                      >
                        {role}
                      </a>
                    ))}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge variant={isEnriched ? "default" : "secondary"} className="text-xs">
                    {isEnriched ? "Enriched" : "Basic"}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  {isEnriched ? (
                    <div className="space-y-1">
                      {lead.emails && lead.emails.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Mail className="w-3 h-3" />
                          {lead.emails.length} email{lead.emails.length > 1 ? 's' : ''}
                        </div>
                      )}
                      {lead.phones && lead.phones.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-blue-600">
                          <Phone className="w-3 h-3" />
                          {lead.phones.length} phone{lead.phones.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not available</span>
                  )}
                </TableCell>
                
                {showEnrichmentButton && (
                  <TableCell>
                    {!isEnriched && (
                      <Button
                        size="sm"
                        onClick={() => onEnrich?.(lead)}
                        className="btn-ghost-futuristic text-xs"
                      >
                        Enrich
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadTable;