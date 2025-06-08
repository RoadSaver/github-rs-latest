import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from '@/utils/translations';
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react';
import ThemeToggle from '@/components/ui/theme-toggle';

const AdminAuth: React.FC = () => {
  const navigate = useNavigate();
  const { login, language, setLanguage } = useApp();
  const t = useTranslation(language);
  
  const handleLogin = (credentials: { username: string; password: string }) => {
    console.log('Admin login attempt:', { username: credentials.username });
    
    // Check for Account Administrator credentials - exact match required
    if (credentials.username.trim() === 'account_admin' && credentials.password === 'AdminAcc93') {
      console.log('Admin credentials valid, logging in...');
      login({ username: credentials.username });
      navigate('/migration');
      toast({
        title: "Admin Login Successful",
        description: "Welcome to RoadSaver Account Manager"
      });
    } else {
      console.log('Invalid admin credentials provided');
      toast({
        title: t("auth-error"),
        description: "Invalid admin credentials. Use username: account_admin and password: AdminAcc93",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-background p-4 font-clash relative">
      
      {/* Top right controls with theme toggle and language switcher */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <ThemeToggle showLabels={false} size="sm" />
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLanguage(language === 'en' ? 'bg' : 'en')}
            aria-label={t(language === 'en' ? 'switch-to-bulgarian' : 'switch-to-english')}
            className="h-10 w-10 bg-purple-600 text-white hover:bg-purple-700"
          >
            <Globe className="h-4 w-4" />
          </Button>
          <span className="absolute -bottom-1 -right-1 text-xs bg-white text-purple-600 px-1 rounded">
            {language.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">RS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              RoadSaver
            </h1>
            <p className="text-muted-foreground text-lg">Account Manager Panel</p>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl text-sm">
            <p className="font-semibold text-blue-900 mb-2">Admin Credentials:</p>
            <div className="space-y-1 text-blue-800">
              <p><span className="font-medium">Username:</span> account_admin</p>
              <p><span className="font-medium">Password:</span> AdminAcc93</p>
            </div>
          </div>
        </div>
        
        <LoginForm 
          onLogin={handleLogin}
          isAdmin={true}
        />
      </div>
    </div>
  );
};

export default AdminAuth;