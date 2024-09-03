import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import logo from "../assets/Images/Logo/VendTune_Logo.png";
import profile from "../assets/Images/Icons/profile.png";
import SideDrawer from "./SideDrawer";
import Button from "@mui/material/Button";
import { useMediaQuery, useTheme, styled, keyframes } from "@mui/material";

const fadeInSlideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedBox = styled(Box)`
  animation: ${fadeInSlideDown} 0.3s ease-out;
`;

const StyledButton = styled(Button)`
  background-color: #f6f6f6;
  color: black;
  padding: 8px 16px;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: #e0e0e0;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

export default function AppBarGrid({ toggleDrawer, logout }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [showSignOutButton, setShowSignOutButton] = React.useState(false);
  const username = localStorage.getItem('username'); 

  const handleToggleSignOutButton = () => {
    setShowSignOutButton(!showSignOutButton);
  };

  return (
    <Box>
      <AppBar>
        <Toolbar
          sx={{
            display: "grid",
            gridTemplateColumns: "0.1fr 9.9fr auto",
            height: { xs: "65px", sm: "65px", md: "40px", lg: "40px" },
            bgcolor: "#2E2E2E",
            position: "static",
          }}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", textAlign: "center" }}>
            <img src={logo} alt="Logo" style={{ height: "30px" }} />
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "8fr 2fr",
              justifyContent: "end",
              alignItems:'center'
            }}
          >
            {!isSmallScreen && (
              <a href={`mailto:${username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography
                  sx={{ color: "#EE6C4D", alignSelf: "center", textAlign: "end", fontWeight: 'bold' }}
                >
                  {username}
                </Typography>
              </a>
            )}
            <IconButton sx={{mr:'-20px'}} onClick={handleToggleSignOutButton}>
              <img src={profile} alt="Profile" style={{ height: "45px" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {showSignOutButton && (
        <AnimatedBox
          sx={{
            position: "fixed",
            top: 65,
            right: 16,
            zIndex: '1000'
          }}
        >
          <StyledButton onClick={logout}>
            Sign Out
          </StyledButton>
        </AnimatedBox>
      )}
      <SideDrawer />
    </Box>
  );
}
