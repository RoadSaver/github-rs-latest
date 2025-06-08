import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AdminLayout from './layout/AdminLayout';
import AdminDashboard from './dashboard/AdminDashboard';
import EnhancedUserManagement from './users/EnhancedUserManagement';
import EnhancedEmployeeManagement from './employees/EnhancedEmployeeManagement';
import EnhancedSimulationManagement from './simulation/EnhancedSimulationManagement';
import { UserAccountService } from '@/services/userAccountService';
import { EmployeeAccountService } from '@/services/employeeAccountService';
import { supabase } from '@/integrations/supabase/client';

const theme = createTheme({
  palette: {
    primary: {
      main: '#673ab7',
      light: '#9c27b0',
      dark: '#512da8',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

const MigrationPanelEnhanced: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'users' | 'employees' | 'simulation'>('dashboard');
  const [migrationStats, setMigrationStats] = useState({
    pendingUsers: 0,
    existingUsers: 0,
    employees: 0,
    simulationEmployees: 0
  });

  const refreshStats = async () => {
    try {
      const [pendingUsers, employees, existingUsers] = await Promise.all([
        UserAccountService.getPendingNewUsers(), 
        EmployeeAccountService.getAllEmployees(),
        UserAccountService.getExistingUsers()
      ]);
      
      // Get simulation employees count
      const { data: simulationEmployees } = await supabase
        .from('employee_simulation')
        .select('*');
      
      setMigrationStats({
        pendingUsers: pendingUsers.length,
        existingUsers: existingUsers?.length || 0,
        employees: employees.length,
        simulationEmployees: simulationEmployees?.length || 0
      });
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  };

  React.useEffect(() => {
    refreshStats();
  }, []);

  const handleLogout = () => {
    window.location.reload();
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <AdminDashboard 
            stats={migrationStats} 
            onNavigate={setCurrentView}
          />
        );
      case 'users':
        return <EnhancedUserManagement onBack={() => setCurrentView('dashboard')} />;
      case 'employees':
        return <EnhancedEmployeeManagement onBack={() => setCurrentView('dashboard')} />;
      case 'simulation':
        return <EnhancedSimulationManagement onBack={() => setCurrentView('dashboard')} />;
      default:
        return (
          <AdminDashboard 
            stats={migrationStats} 
            onNavigate={setCurrentView}
          />
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AdminLayout
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      >
        {renderContent()}
      </AdminLayout>
    </ThemeProvider>
  );
};

export default MigrationPanelEnhanced;