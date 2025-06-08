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
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Block,
  CheckCircle,
  Search,
  FilterList,
  Download,
  Work,
  Phone,
  Email,
} from '@mui/icons-material';
import { EmployeeAccountService } from '@/services/employeeAccountService';
import { toast } from '@/components/ui/use-toast';

interface Employee {
  id: string;
  username: string;
  email: string;
  phone_number?: string;
  employee_role?: string;
  status?: string;
  real_name?: string;
  created_at: string;
}

interface EnhancedEmployeeManagementProps {
  onBack: () => void;
}

const EnhancedEmployeeManagement: React.FC<EnhancedEmployeeManagementProps> = ({ onBack }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    real_name: '',
    username: '',
    email: '',
    phone_number: '+359',
    employee_role: 'technician'
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const employeeData = await EmployeeAccountService.getAllEmployees();
      setEmployees(employeeData || []);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, employee: Employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  const handleCreateEmployee = async () => {
    try {
      await EmployeeAccountService.createEmployeeAccount(newEmployee);
      toast({
        title: "Success",
        description: "Employee created successfully"
      });
      setShowCreateDialog(false);
      setNewEmployee({
        real_name: '',
        username: '',
        email: '',
        phone_number: '+359',
        employee_role: 'technician'
      });
      loadEmployees();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create employee",
        variant: "destructive"
      });
    }
  };

  const handleStatusToggle = async () => {
    if (!selectedEmployee) return;
    
    try {
      const newStatus = selectedEmployee.status === 'suspended' ? 'active' : 'suspended';
      await EmployeeAccountService.updateEmployeeStatus(selectedEmployee.id, newStatus);
      toast({
        title: "Success",
        description: `Employee ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully`
      });
      loadEmployees();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee status",
        variant: "destructive"
      });
    }
    handleMenuClose();
  };

  const filteredEmployees = employees.filter(employee =>
    employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.real_name && employee.real_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusChip = (status?: string) => {
    switch (status) {
      case 'suspended':
        return <Chip label="Suspended\" color="error\" size="small" />;
      case 'inactive':
        return <Chip label="Inactive\" color="warning\" size="small" />;
      default:
        return <Chip label="Active\" color="success\" size="small" />;
    }
  };

  const getRoleChip = (role?: string) => {
    const roleColors: Record<string, any> = {
      admin: 'error',
      manager: 'warning',
      supervisor: 'info',
      technician: 'default'
    };
    
    return (
      <Chip 
        label={role || 'technician'} 
        color={roleColors[role || 'technician']} 
        size="small" 
        variant="outlined" 
      />
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Employee Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage technicians and service providers
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowCreateDialog(true)}
          sx={{ borderRadius: 2 }}
        >
          Add Employee
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {employees.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Employees
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {employees.filter(e => e.status === 'active' || !e.status).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {employees.filter(e => e.employee_role === 'technician').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Technicians
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {employees.filter(e => e.status === 'suspended').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Suspended
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
              placeholder="Search employees..."
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

      {/* Employees Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEmployees.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <Work />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {employee.real_name || employee.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          @{employee.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2">{employee.email}</Typography>
                      </Box>
                      {employee.phone_number && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {employee.phone_number}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{getRoleChip(employee.employee_role)}</TableCell>
                  <TableCell>{getStatusChip(employee.status)}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(employee.created_at).toLocaleDateString()}
                    </Typography>
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
        <MenuItem onClick={handleStatusToggle}>
          {selectedEmployee?.status === 'suspended' ? (
            <>
              <CheckCircle sx={{ mr: 1 }} />
              Activate Employee
            </>
          ) : (
            <>
              <Block sx={{ mr: 1 }} />
              Suspend Employee
            </>
          )}
        </MenuItem>
      </Menu>

      {/* Create Employee Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={newEmployee.real_name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, real_name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  value={newEmployee.username}
                  onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value.toLowerCase() })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={newEmployee.phone_number}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone_number: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={newEmployee.employee_role}
                    label="Role"
                    onChange={(e) => setNewEmployee({ ...newEmployee, employee_role: e.target.value })}
                  >
                    <SelectMenuItem value="technician">Technician</SelectMenuItem>
                    <SelectMenuItem value="supervisor">Supervisor</SelectMenuItem>
                    <SelectMenuItem value="manager">Manager</SelectMenuItem>
                    <SelectMenuItem value="admin">Admin</SelectMenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateEmployee}
            disabled={!newEmployee.real_name || !newEmployee.username || !newEmployee.email}
          >
            Create Employee
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnhancedEmployeeManagement;