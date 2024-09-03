import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
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
import postRegister from "../services/postRegister";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Register.scss";
import CustomToast from "../components/CustomToast";

const containerStyle = {
  bgcolor: "white",
  width: "100%",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
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
  backdropFilter: "blur(5px)",
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
  input: { color: "black" },
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
  mt: 5,
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

export default function Register() {
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [passwordStrength, setPasswordStrength] = React.useState("");
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    return () => navigate(path);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    let strength = "Weak";
    if (password.length >= 8) {
      strength = "Medium";
      if (
        /[A-Z]/.test(password) &&
        /\d/.test(password) &&
        /[@$!%*?&#]/.test(password)
      ) {
        strength = "Strong";
      }
    }
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const businessName = data.get("businessName");
    const businessEmail = data.get("email");
    const password = data.get("new-password");
    const passwordConf = data.get("confirm-password");

    if (emailError) {
      toast.error(emailError, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
      return;
    }

    if (password !== passwordConf) {
      toast.error("Passwords do not match. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
      return;
    }

    try {
      const res = await postRegister(businessName, businessEmail, password);
      if (res.status >= 200 && res.status < 300) {
        localStorage.setItem("username", businessEmail);
        navigate("/dashboard");
      } else {
        toast(<CustomToast />);
      }
    } catch (error) {
      console.log(error);
      toast(<CustomToast />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={containerStyle}>
        <Box sx={boxStyle}>
          <Avatar sx={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={typographyStyle}>
            Register
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="businessName"
                  required
                  fullWidth
                  id="businessName"
                  label="Business Name"
                  autoFocus
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Business Email Address"
                  name="email"
                  autoComplete="email"
                  sx={textFieldStyle}
                  onChange={handleEmailChange}
                  error={!!emailError}
                  helperText={emailError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="new-password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  autoComplete="new-password"
                  sx={textFieldStyle}
                  onChange={handlePasswordChange}
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
                {passwordStrength && (
                  <Typography
                    sx={{ fontSize: "11px", mt: "5px", ml: "15px" }}
                    variant="body2"
                    color={
                      passwordStrength === "Strong"
                        ? "green"
                        : passwordStrength === "Medium"
                        ? "orange"
                        : "red"
                    }
                  >
                    Password Strength: {passwordStrength}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirm-password"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  autoComplete="new-password"
                  sx={textFieldStyle}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={buttonStyle}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link onClick={handleNavigate("/login")}  variant="body2" sx={linkStyle}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={copyrightStyle} />
      </Box>
    </Container>
  );
}
