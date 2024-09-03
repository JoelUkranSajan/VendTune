import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../services/postLogin';
import '../styles/Login.scss';
import CustomToast from '../components/CustomToast';
import AuthContext from '../components/AuthContext';

const containerStyle = {
  bgcolor: 'white',
  width: '100%',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const boxStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  animation: "fadeIn 1s ease-in-out",
  color: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0px 0px 100px 15px #ff7043",
  backdropFilter: 'blur(5px)',
};

const avatarStyle = {
  m: 1,
  bgcolor: "#ff7043",
  width: 56,
  height: 56,
  animation: "bounce 1s infinite",
};

const typographyStyle = {
  fontFamily: "'Roboto', sans-serif",
  fontWeight: "bold",
  color: "#ff7043",
  letterSpacing: "0.5px",
};

const textFieldStyle = {
  "& .MuiInputLabel-root": { color: "black" },
  "& .MuiOutlinedInput-root": {
    "& > fieldset": { borderColor: "black" },
  },
  "& .MuiOutlinedInput-root:hover": {
    "& > fieldset": { borderColor: "black" },
  },
  "& .MuiOutlinedInput-root.Mui-focused": {
    "& > fieldset": { borderColor: "black" },
  },
  input: { color: "black" }
};

const formControlLabelStyle = {
  "& .MuiTypography-root": {
    fontSize: "0.875rem",
    color: "#ff7043",
  },
};

const buttonStyle = {
  mt: 3,
  mb: 2,
  py: 1.5,
  fontSize: "1rem",
  fontWeight: "bold",
  textTransform: "none",
  bgcolor: "#ff7043",
  color: "white",
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  "&:hover": {
    bgcolor: "#ff8a65",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .5)",
  },
  transition: "all 0.3s ease-in-out",
};

const linkStyle = {
  color: "#ff7043",
  cursor: "pointer",
};

const copyrightStyle = {
  mt: 8,
  mb: 4,
  color: "black",
};

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        VendTune
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignIn() {
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = React.useContext(AuthContext);

  const handleNavigate = (path) => {
    return () => navigate(path);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; 
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const username = data.get("email");
    const password = data.get("password");

    try {
      const res = await login(username, password);
      
      if (res.status >= 200 && res.status < 300) {
        localStorage.setItem('username', username); 
        authLogin(); 
        navigate("/dashboard");
      } else {
        toast(<CustomToast />);
      }
    } catch (error) {
      toast(<CustomToast />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={containerStyle}>
      <Container component="main" maxWidth="xs">
        <Box sx={boxStyle}>
          <Avatar sx={avatarStyle}>
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={typographyStyle}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              sx={textFieldStyle}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              sx={textFieldStyle}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              sx={formControlLabelStyle}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={buttonStyle}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
            <Grid container>
              <Grid item>
                <Link onClick={handleNavigate("/register")} variant="body2" sx={linkStyle}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={copyrightStyle} />
      </Container>
    </Box>
  );
}
