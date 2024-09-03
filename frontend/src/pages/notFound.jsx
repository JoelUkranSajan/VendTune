import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

const NotFound = () => {
  return (
    <Container>
      <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ marginTop: '50px' }}>
        <Grid item xs={12} md={6}>
          <img
            src="https://via.placeholder.com/400x300.png?text=404+Not+Found"
            alt="Page not found"
            style={{ width: '100%', height: 'auto' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" component="h1" sx={{ color: 'text.primary', marginBottom: '16px' }}>
              404 - Page Not Found
            </Typography>
            <Typography variant="body1" component="p" sx={{ color: 'text.secondary', marginBottom: '32px' }}>
              Oops! The page you are looking for might have been removed or is temporarily unavailable.
            </Typography>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary" sx={{ textTransform: 'none' }}>
                Go to Home
              </Button>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NotFound;
