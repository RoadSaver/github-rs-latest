import React from 'react';
import { Grid, Box, Typography, Card, CardContent, LinearProgress } from '@mui/material';
import { People, Work, Assessment, TrendingUp } from '@mui/icons-material';
import StatCard from './StatCard';

interface AdminDashboardProps {
  stats: {
    pendingUsers: number;
    existingUsers: number;
    employees: number;
    simulationEmployees: number;
  };
  onNavigate: (view: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats, onNavigate }) => {
  const totalUsers = stats.pendingUsers + stats.existingUsers;
  const totalEmployees = stats.employees + stats.simulationEmployees;

  return (
    <Box>
      <Typography variant="h4\" fontWeight="bold\" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to RoadSaver Account Manager. Monitor and manage your platform.
      </Typography>

      <Grid container spacing={3}>
        {/* Stat Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={<People />}
            color="primary"
            trend={{ value: 12, isPositive: true }}
            subtitle="Active platform users"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Employees"
            value={stats.employees}
            icon={<Work />}
            color="success"
            trend={{ value: 8, isPositive: true }}
            subtitle="Active technicians"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Simulation Pool"
            value={stats.simulationEmployees}
            icon={<Assessment />}
            color="info"
            subtitle="Demo employees"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Growth Rate"
            value="24%"
            icon={<TrendingUp />}
            color="warning"
            trend={{ value: 5, isPositive: true }}
            subtitle="Monthly growth"
          />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                    }}
                    onClick={() => onNavigate('users')}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <People color="primary" />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            Manage Users
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            View and manage user accounts
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                    }}
                    onClick={() => onNavigate('employees')}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Work color="success" />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            Manage Employees
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            View and manage technicians
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                System Status
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Database</Typography>
                  <Typography variant="body2" color="success.main">Healthy</Typography>
                </Box>
                <LinearProgress variant="determinate" value={95} color="success" />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">API Response</Typography>
                  <Typography variant="body2" color="success.main">Fast</Typography>
                </Box>
                <LinearProgress variant="determinate" value={88} color="success" />
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Storage</Typography>
                  <Typography variant="body2" color="warning.main">75%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={75} color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;