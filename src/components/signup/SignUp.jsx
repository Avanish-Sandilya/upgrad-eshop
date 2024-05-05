import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { doSignup } from "../../api/userAuthAPIs";
import useAuthentication from "../../hooks/useAuthentication";
import useServices from "../../hooks/useServices";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: { value: "", error: false, errorMessage: null },
    lastName: { value: "", error: false, errorMessage: null },
    email: { value: "", error: false, errorMessage: null },
    password: {
      value: "",
      error: false,
      errorMessage: "Please enter a valid password.",
    },
    confirmPassword: { value: "", error: false, errorMessage: null },
    contactNumber: { value: "", error: false, errorMessage: null },
  });

  const [busy, setBusy] = useState(false);
  const { ServicesCtx } = useServices();
  const { broadcastMessage } = useContext(ServicesCtx);
  const { AuthCtx } = useAuthentication();
  const { loggedInUser } = useContext(AuthCtx);

  const validateData = () => {
    setBusy(true);
    const data = { ...formData };
    let requestJson = {};
    let valid = true;

    for (let field in formData) {
      const { value } = formData[field];
      const { valid: isValid, message } = getValidity(field, value);

      data[field] = { ...data[field], error: !isValid, errorMessage: message };
      valid = valid && isValid;

      if (isValid) {
        requestJson[field] = value;
      }
    }

    setFormData(data);

    if (valid) {
      doSignup(requestJson)
        .then((json) => {
          broadcastMessage(json.message, "success");
          setBusy(false);
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            contactNumber: "",
          });
        })
        .catch((json) => {
          broadcastMessage(json.reason, "error");
          setBusy(false);
        });
    } else {
      setBusy(false);
    }
  };

  const matchRegex = (value, re) => new RegExp(re).test(value);

  const getValidity = (field, value) => {
    let valid = true;
    let message = null;

    switch (field) {
      case "firstName":
      case "lastName":
        if (value.length > 255) {
          valid = false;
          message = `${field} can be of length 255 characters`;
        } else {
          valid = matchRegex(value, "^([A-Za-z]+)$");
          message = `Please enter valid ${field}`;
        }
        break;

      case "email":
        if (value.length > 255) {
          valid = false;
          message = "Email can be of length 255 characters";
        } else {
          valid = matchRegex(
            value,
            "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$"
          );
          message = "Please enter valid email";
        }
        break;

      case "password":
        if (value.length < 6 || value.length > 40) {
          valid = false;
          message = "Password's length must be between 6 and 40.";
        } else {
          valid = matchRegex(
            value,
            "^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,40}$"
          );
          message =
            "Password must contain at least one symbol, upper and lower case letters, and a number.";
        }
        break;

      case "confirmPassword":
        valid = value === formData.password.value;
        message = "Passwords do not match.";
        break;

      case "contactNumber":
        valid = matchRegex(value, "^([7-9]{1}[0-9]{9})$");
        message = "Please enter valid contact number.";
        break;

      default:
        break;
    }

    if (!value.trim()) {
      valid = false;
      message = "This field is required.";
    }

    return { valid, message };
  };

  const validateAndSaveInMemory = (fieldName, value) => {
    const { valid, message } = getValidity(fieldName, value);
    setFormData({
      ...formData,
      [fieldName]: { ...formData[fieldName], error: !valid, errorMessage: message },
    });
  };

  const saveOnChange = (field, value) => {
    setFormData({ ...formData, [field]: { ...formData[field], value } });
  };

  if (loggedInUser !== null) {
    return <Navigate to="/home" />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid container item spacing={3}>
          <Grid item xs={4} />
          <Grid item xs={4}>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
              <LockOutlinedIcon
                style={{
                  display: "inline-block",
                  borderRadius: "60px",
                  padding: "0.6em 0.6em",
                  color: "#ffffff",
                  background: "#f50057",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Typography variant="subtitle1" noWrap sx={{ fontSize: "25px", color: "inherit" }}>
                Sign up
              </Typography>
            </div>
            {/* Form Fields */}
            {Object.keys(formData).map((field) => (
              <div key={field} style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
                <TextField
                  id={field}
                  label={`${field.charAt(0).toUpperCase()}${field.slice(1)} *`}
                  variant="outlined"
                  fullWidth
                  type={field === "password" || field === "confirmPassword" ? "password" : "text"}
                  value={formData[field].value}
                  onChange={(event) => saveOnChange(field, event.target.value)}
                  onBlur={(event) => validateAndSaveInMemory(field, event.target.value)}
                  error={formData[field].error}
                  helperText={formData[field].error && formData[field].errorMessage}
                />
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
              <Button variant="contained" color="primary" fullWidth onClick={validateData}>
                SIGN UP
              </Button>
            </div>
            <div style={{ display: "flex", justifyContent: "right", marginTop: "30px" }}>
              <Link to="/login">
                <Typography variant="body1">Already have an account? Sign in</Typography>
              </Link>
            </div>
          </Grid>
          <Grid item xs={4} />
        </Grid>
      </Grid>
      {/* Loading Indicator */}
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={busy}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default SignUp;
