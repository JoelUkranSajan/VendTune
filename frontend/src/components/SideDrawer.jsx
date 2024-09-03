import React from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import SettingsIcon from '@mui/icons-material/Settings';

export default function SideDrawer({ isOpen, toggleDrawer }) {
  const navigate = useNavigate();

  const handleDrawerToggle = (open) => (event) => {
    if (typeof toggleDrawer === 'function') {
      toggleDrawer(open)(event);
    } else {
      console.error('toggleDrawer is not a function');
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'My Business', icon: <BusinessIcon />, path: '/business' },
    { text: 'Services', icon: <EditCalendarIcon />, path: '/services' },
  ];

  const DrawerList = (
    <Box
      sx={{ width: 250, top: '100px' }}
      role="presentation"
      onClick={handleDrawerToggle(false)}
    >
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      open={isOpen}
      onClose={handleDrawerToggle(false)}
      sx={{
        '& .MuiDrawer-paper': {
          marginTop: '64px',
          backgroundColor: '#CACACA',
        },
      }}
    >
      {DrawerList}
    </Drawer>
  );
}
