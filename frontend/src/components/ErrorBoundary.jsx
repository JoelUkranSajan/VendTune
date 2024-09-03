import React from 'react';
import { Box, Button, Typography } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Oops! Something went wrong.
          </Typography>
          <Typography variant="body1" gutterBottom>
            We apologize for the inconvenience. Please try reloading the page.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={this.handleReload}
            sx={{ marginTop: '20px' }}
          >
            Reload Page
          </Button>
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: '10px' }}>
            If the problem persists, please contact support.
          </Typography>
        </Box>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
