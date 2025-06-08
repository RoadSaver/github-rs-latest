import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, useTheme, alpha } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend, subtitle }) => {
  const theme = useTheme();
  
  const colorMap = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    info: theme.palette.info.main,
  };

  const selectedColor = colorMap[color];

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
        border: '1px solid',
        borderColor: alpha(selectedColor, 0.1),
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${alpha(selectedColor, 0.15)}`,
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              backgroundColor: alpha(selectedColor, 0.1),
              color: selectedColor,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
        
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {trend.isPositive ? (
              <TrendingUp sx={{ color: theme.palette.success.main, fontSize: 16 }} />
            ) : (
              <TrendingDown sx={{ color: theme.palette.error.main, fontSize: 16 }} />
            )}
            <Typography 
              variant="caption" 
              sx={{ 
                color: trend.isPositive ? theme.palette.success.main : theme.palette.error.main,
                fontWeight: 600 
              }}
            >
              {trend.value}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;