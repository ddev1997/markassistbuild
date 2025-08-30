import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const DashboardHeader: React.FC = () => {
  const { user, logout, credits, isOutOfCredits } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-primary/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            MarkAssist
          </h1>
          <p className="text-sm text-muted-foreground">AI-Powered Marketing Assistant Platform</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isOutOfCredits ? 'bg-destructive/10' : 'bg-primary-light'}`}>
              <CreditCard className={`w-4 h-4 ${isOutOfCredits ? 'text-destructive' : 'text-primary'}`} />
              <span className={`text-sm font-semibold ${isOutOfCredits ? 'text-destructive' : 'text-primary'}`}>
                {credits} Credits
              </span>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-primary/10">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{user.username}</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;