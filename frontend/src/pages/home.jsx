import React, { useState, useEffect } from "react";
import { Box, Button, Grid, Typography, Link } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import logo from "../assets/Images/Logo/VendTune_Logo.png";
import dashboard from "../assets/Images/StockImages/DashboardImg.png";
import business from "../assets/Images/StockImages/BusinessImg.png";
import services from "../assets/Images/StockImages/ServicesImg.png";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const tapAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: none;
  }
  50% {
    transform: scale(0.95);
    box-shadow: 0px 4px 20px #ff4500;
  }
  100% {
    transform: scale(1);
    box-shadow: none;
  }
`;

const imageFadeIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const buttonStyle = {
  textAlign: { xs: "center", md: "end" },
  cursor:"pointer",
  p: "10px",
  transform: "scale(0.95)",
  transition: "background-color 0.3s, box-shadow 0.3s",
  "&:hover": {
    background: "#EE6C4D",
    color: "black",
    transform: "scale(1)",
    boxShadow: "0px 4px 20px #ff4500",
    "& .MuiTypography-root": {
      color: "black",
    },
  },
  "&:active": {
    animation: `${tapAnimation} 0.3s ease`,
  },
};

const SignInLink = styled(Link)`
  text-decoration: none;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 20px;
  position: relative;
  transition: color 0.3s, transform 0.3s;

  &:hover {
    color: #EE6C4D;
    transform: translateX(5px);
    &::after {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &::after {
    content: "→";
    position: absolute;
    right: -15px;
    top: 0;
    opacity: 0;
    transform: translateX(-10px);
    transition: opacity 0.3s, transform 0.3s;
  }
`;

const ImageContainer = styled("img")`
  width: 100%;
  max-width: 784px;
  justify-content: start;
  &.fade-in {
    animation: ${imageFadeIn} 0.5s ease-in-out;
  }
`;

const Home = () => {
  const [image, setImage] = useState(dashboard);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleNavigate = (path) => {
    return () => navigate(path);
  };

  useEffect(() => {
    if (fadeIn) {
      const timer = setTimeout(() => setFadeIn(false), 500);
      return () => clearTimeout(timer);
    }
  }, [fadeIn]);

  const handleButton = (text) => {
    setFadeIn(true);
    if (text === "Dashboard") {
      setImage(dashboard);
    } else if (text === "Business") {
      setImage(business);
    } else {
      setImage(services);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#333",
        position: "fixed",
        top: "0px",
        left: "0px",
        p: "10px",
        pb: "0px",
        height: "100%",
        width: "auto"
      }}
    >
      <Box
        sx={{
          backgroundColor: "#333333",
          color: "white",
          height: { xs: "100vh", md: "100%" },
          width: "100%",
          mb: "0px",
        }}
      >
        <Grid container spacing={2} sx={{}}>
          <Grid item xs={6} sx={{ textAlign: "start" }}>
            <Box sx={{ display: "flex", textAlign: "center" }}>
              <img src={logo} alt="Logo" style={{ height: "30px" }} />
            </Box>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "end" }}>
          <SignInLink
              onClick={handleNavigate("/login")}
              sx={{ cursor: "pointer" }}
            >
              Sign in
            </SignInLink>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                fontSize: {
                  xs: "2rem",
                  sm: "2.5rem",
                  md: "2.8rem",
                },
              }}
            >
              Mobile Food Vending Made Easy
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#9A9999",
                fontSize: {
                  xs: "1rem",
                  sm: "1.25rem",
                  md: "1.5rem",
                },
              }}
            >
              A Data-Driven Approach to Managing Your Mobile Food Vending
              Business
            </Typography>
          </Grid>
          <Grid
            name="button list"
            sx={{ alignContent: "center", order: isSmallScreen ? 2 : 1 }}
            item
            xs={12}
            md={4}
          >
            <Grid
              item
              xs={12}
              sx={buttonStyle}
              onClick={() => handleButton("Dashboard")}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  marginBottom: "10px",
                  fontSize: {
                    xs: "1.2rem",
                    sm: "1.5rem",
                    md: "1.75rem",
                  },
                }}
              >
                High-level Dashboard
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#9A9999",
                  marginBottom: "20px",
                  fontSize: {
                    xs: "0.875rem",
                    sm: "1rem",
                    md: "1.125rem",
                  },
                }}
              >
                Track key metrics and monitor your business' growth
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={buttonStyle}
              onClick={() => handleButton("Business")}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  marginBottom: "10px",
                  fontSize: {
                    xs: "1.2rem",
                    sm: "1.5rem",
                    md: "1.75rem",
                  },
                }}
              >
                Business Management
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#9A9999",
                  marginBottom: "20px",
                  fontSize: {
                    xs: "0.875rem",
                    sm: "1rem",
                    md: "1.125rem",
                  },
                }}
              >
                Add and monitor business units and authorized vendors
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={buttonStyle}
              onClick={() => handleButton("Location")}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  marginBottom: "10px",
                  fontSize: {
                    xs: "1.2rem",
                    sm: "1.5rem",
                    md: "1.75rem",
                  },
                }}
              >
                Location Recommendation
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#9A9999",
                  marginBottom: "20px",
                  fontSize: {
                    xs: "0.875rem",
                    sm: "1rem",
                    md: "1.125rem",
                  },
                }}
              >
                Plan your set-up location based on busyness data
              </Typography>
            </Grid>
          </Grid>
          <Grid
            name="image list"
            item
            xs={12}
            md={8}
            sx={{ textAlign: "center", marginTop: "0px", order: isSmallScreen ? 1 : 2 }}
          >
            <ImageContainer
              src={image}
              alt="Overview"
              className={fadeIn ? "fade-in" : ""}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center", marginTop: "0px" , order : 3}}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "orangered",
                color: "white",
                padding: "10px 20px",
                fontSize: "18px",
                borderRadius: "10px",
                "&:hover": { 
                  backgroundColor: "#EE6C4D",
                  boxShadow: "0px 4px 20px #ff4500",
                },
              }}
              href="/register"
            >
              Start Today - It's Free!
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
