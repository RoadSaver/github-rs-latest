import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Avatar,
  Tooltip,
  TablePagination,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Search,
  FilterList,
  Download,
  Psychology,
  Person,
} from '@mui/icons-material';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface SimulationEmployee {
  id: number;
  employee_number: number;
  full_name: string;
  created_at: string;
}

interface EnhancedSimulationManagementProps {
  onBack: () => void;
}

const EnhancedSimulationManagement: React.FC<EnhancedSimulationManagementProps> = ({ onBack }) => {
  const [simulationEmployees, setSimulationEmployees] = useState<SimulationEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<SimulationEmployee | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    employee_number: '',
    full_name: ''
  });

  useEffect(() => {
    loadSimulationEmployees();
  }, []);

  const loadSimulationEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_simulation')
        .select('*')
        .order('employee_number');

      if (error) throw error;
      setSimulationEmployees(data || []);
    } catch (error) {
      console.error('Error loading simulation employees:', error);
      toast({
        title: "Error",
        description: "Failed to load simulation employees",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, employee: SimulationEmployee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  const handleCreateEmployee = async () => {
    try {
      const { error } = await supabase
        .from('employee_simulation')
        .insert({
          employee_number: parseInt(newEmployee.employee_number),
          full_name: newEmployee.full_name
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Simulation employee created successfully"
      });
      
      setShowCreateDialog(false);
      setNewEmployee({ employee_number: '', full_name: '' });
      loadSimulationEmployees();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create simulation employee",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    try {
      const { error } = await supabase
        .from('employee_simulation')
        .delete()
        .eq('id', selectedEmployee.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Simulation employee deleted successfully"
      });
      
      loadSimulationEmployees();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete simulation employee",
        variant: "destructive"
      });
    }
    handleMenuClose();
  };

  const filteredEmployees = simulationEmployees.filter(employee =>
    employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employee_number.toString().includes(searchTerm)
  );

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getNextEmployeeNumber = () => {
    if (simulationEmployees.length === 0) return 1;
    return Math.max(...simulationEmployees.map(e => e.employee_number)) + 1;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Simulation Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage demo employees for service simulation
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setNewEmployee({ 
              employee_number: getNextEmployeeNumber().toString(), 
              full_name: '' 
            });
            setShowCreateDialog(true);
          }}
          sx={{ borderRadius: 2 }}
        >
          Add Demo Employee
        </Button>
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          These are demo employees used for service request simulation. They help provide realistic responses 
          to user requests without requiring real technicians to be online.
        </Typography>
      </Alert>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {simulationEmployees.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Demo Employees
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {simulationEmployees.length > 0 ? Math.max(...simulationEmployees.map(e => e.employee_number)) : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Highest Employee #
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {simulationEmployees.filter(e => 
                  new Date(e.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                ).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Added This Week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search demo employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
            />
            <Button startIcon={<FilterList />} variant="outlined">
              Filters
            </Button>
            <Button startIcon={<Download />} variant="outlined">
              Export
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Simulation Employees Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee #</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEmployees.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'info.main' }}>
                        <Psychology />
                      </Avatar>
                      <Typography variant="subtitle2" fontWeight={600}>
                        #{employee.employee_number}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">{employee.full_name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(employee.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label="Active" color="success" size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="More actions">
                      <IconButton onClick={(e) => handleMenuOpen(e, employee)}>
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1 }} />
          Edit Employee
        </MenuItem>
        <MenuItem onClick={handleDeleteEmployee} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete Employee
        </MenuItem>
      </Menu>

      {/* Create Employee Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Demo Employee</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee Number"
                  type="number"
                  value={newEmployee.employee_number}
                  onChange={(e) => setNewEmployee({ ...newEmployee, employee_number: e.target.value })}
                  helperText="Unique identifier for the demo employee"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={newEmployee.full_name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, full_name: e.target.value })}
                  helperText="Display name for the demo employee"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateEmployee}
            disabled={!newEmployee.employee_number || !newEmployee.full_name}
          >
            Create Demo Employee
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnhancedSimulationManagement;