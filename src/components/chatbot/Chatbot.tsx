
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Search, Database, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ChatbotProps {
  onClose: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNewLead = () => {
    navigate('/dashboard/lead-generation');
    onClose();
  };

  const handleFindMoreClient = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://my-fastapi-service-608954479960.us-central1.run.app/find_existing_query/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // The API returns an array directly
      setSuggestions(Array.isArray(data) ? data : []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch suggestions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://my-fastapi-service-608954479960.us-central1.run.app/find_existing_query_value', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ value: suggestion }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }

      const data = await response.json();
      console.log('Lead data:', data);
      
      // Store the leads and redirect to management
      localStorage.setItem('generatedLeads', JSON.stringify(data.leads || data));
      navigate('/dashboard/lead-management');
      onClose();
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leads for this category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Processing your request..." />;
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 glass-card shadow-glow z-50 animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary">
            <MessageCircle className="w-5 h-5" />
            AI Assistant
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-primary-light p-4 rounded-xl">
          <p className="text-sm text-foreground mb-3">
            Hello! I'm here to help you find leads and grow your business. What would you like to do?
          </p>
        </div>

        {!showSuggestions ? (
          <div className="space-y-3">
            <Button 
              onClick={handleNewLead}
              className="w-full btn-futuristic"
            >
              <Search className="w-4 h-4 mr-2" />
              NewLead
            </Button>
            
            <Button 
              onClick={handleFindMoreClient}
              className="w-full btn-ghost-futuristic"
            >
              <Database className="w-4 h-4 mr-2" />
              FindMoreClient
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Select a category to find existing leads:</p>
            
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start hover:bg-primary/5 hover:border-primary"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSuggestions(false)}
              className="w-full"
            >
              Back to main menu
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Chatbot;
