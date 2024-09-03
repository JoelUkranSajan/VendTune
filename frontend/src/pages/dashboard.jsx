import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import AppBar from '../components/HamburgerBox';
import DataGridDemo from '../components/DataGrid';
import getDashboardInfo from '../services/getDashboardInfo';
import { useNavigate } from 'react-router-dom';

function logout(navigate) {
  localStorage.clear();
  navigate('/login');
}

const Dashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [additionalData, setAdditionalData] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardInfo(setServices, setLoading, setError, setAdditionalData).then(() => {
      if (additionalData.totalRevenue === 0) {
        setAlertOpen(true);
      }
    });
  }, [additionalData.totalRevenue]);

  const columns = [
    { field: "date", headerName: "Date", width: 150, editable: false },
    { field: "time", headerName: "Time", width: 150, editable: false },
    { field: "unit", headerName: "Unit", width: 150, editable: false },
    { field: "vendors", headerName: "Vendors", width: 150, editable: false },
    { field: "address", headerName: "Address", width: 200, editable: false },
  ];

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await deleteService(deleteId);
      await getDashboardInfo(setServices, setLoading, setError, setAdditionalData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <AppBar logout={() => logout(navigate)} />
      <Grid sx={{ mt: "30px" }} container spacing={2}>
        <Grid item xs={12} md={4}>
          <Box sx={{ backgroundColor: 'lightgrey', padding: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h4">${additionalData.totalRevenue?.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ backgroundColor: 'lightgrey', padding: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="h6">Best Performing Unit</Typography>
            <Typography variant="h5">{additionalData.bestUnit}</Typography>
          </Box>
          <Box sx={{ backgroundColor: 'lightgrey', padding: 2, borderRadius: 1 }}>
            <Typography variant="h6">Best Performing Vendor</Typography>
            <Typography variant="h5">{additionalData.bestVendor}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ backgroundColor: 'lightgrey', padding: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="h6">Most Profitable Location</Typography>
            <Typography variant="h5">{additionalData.mostProfitableLocation}</Typography>
          </Box>
          <MapContainer center={[40.7128, -74.0060]} zoom={11} style={{ height: '220px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {additionalData.mostProfitableLocationCoords && additionalData.totalRevenue !== 0 && (
              <Marker position={additionalData.mostProfitableLocationCoords}>
                {additionalData.mostProfitableLocation && (
                  <Popup>
                    {additionalData.mostProfitableLocation}
                  </Popup>
                )}
              </Marker>
            )}
          </MapContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ backgroundColor: 'lightgrey', padding: 2, borderRadius: 1 }}>
            <Typography variant="h6">Revenue Growth</Typography>
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={additionalData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid item xs={12}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGridDemo rows={services} columns={columns} />
          )}
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Service</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this service?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={alertOpen} onClose={() => setAlertOpen(false)}>
        <DialogTitle>Alert</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Dashboard services are visible after adding the services in the service page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertOpen(false)} color="primary">OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
