import { useState, useContext, useEffect } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import useAuthentication from "../../hooks/useAuthentication";
import useServices from "../../hooks/useServices";

const initialState = {
    username: {
        value: "",
        error: false,
        errorMessage: null,
    },
    password: {
        value: "",
        error: false,
        errorMessage: "Please enter a valid password.",
    },
};

const Login = () => {
    const [formData, setFormData] = useState(initialState);
    const [busy, setBusy] = useState(false);
    const { AuthCtx } = useAuthentication();
    const { login, loggedInUser } = useContext(AuthCtx);
    const history = useNavigate();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/home" } };
    const { ServicesCtx } = useServices();
    const { broadcastMessage } = useContext(ServicesCtx);

    useEffect(() => {
        if (loggedInUser) {
            history(from, { replace: true });
        }
    }, [loggedInUser, from, history]);

    const validateAndLoginData = () => {
        setBusy(true);
        const data = { ...formData };
        let requestJson = {};
        let validDetails = true;
        for (let key in formData) {
            const json = getValidity(key, formData[key].value);
            data[key] = { ...data[key], error: !json.valid, errorMessage: json.message };
            validDetails = validDetails && json.valid;
            if (json.valid) {
                requestJson[key] = data[key].value;
            }
        }
        setFormData(data);
        if (validDetails) {
            login(requestJson.username, requestJson.password)
                .then(() => {
                    broadcastMessage("Login successful", "success");
                })
                .catch((json) => {
                    broadcastMessage(json.reason, "error");
                })
                .finally(() => {
                    setBusy(false);
                });
        } else {
            setBusy(false);
        }
    };

    const matchRegex = (value, re) => {
        const regex = new RegExp(re);
        return regex.test(value);
    };

    const getValidity = (field, value) => {
        let valid = true;
        let message = null;
        if (!value || value.length === 0) {
            valid = false;
            message = "This field is required.";
        } else {
            switch (field) {
                case "username":
                    valid = value.length <= 255 && matchRegex(value, "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$");
                    message = valid ? null : "Please enter a valid email.";
                    break;
                case "password":
                    valid = value.length >= 6 && value.length <= 40;
                    message = valid ? null : "Password's length must be between 6 and 40.";
                    break;
                default:
                    break;
            }
        }
        return { valid, message };
    };

    const validateAndSaveLoginData = (fieldName, fieldValue) => {
        const json = getValidity(fieldName, fieldValue);
        const data = { ...formData, [fieldName]: { ...formData[fieldName], error: !json.valid, errorMessage: json.message } };
        setFormData(data);
    };

    const saveOnFieldChange = (field, value) => {
        setFormData((prevData) => ({ ...prevData, [field]: { ...prevData[field], value } }));
    };

    if (loggedInUser === null) {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1}>
                    <Grid container item spacing={3}>
                        <Grid item xs={4} />
                        <Grid item xs={4}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: "10%" }}>
                                <LockOutlinedIcon style={{ display: 'inline-block', borderRadius: '60px', padding: '0.6em 0.6em', color: '#ffffff', background: "#f50057" }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Typography variant="subtitle1" noWrap sx={{ fontSize: "25px", color: 'inherit' }}>
                                    Sign in
                                </Typography>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: "30px" }}>
                                <TextField
                                    id="username"
                                    label="Email Address *"
                                    variant="outlined"
                                    fullWidth
                                    type="email"
                                    value={formData.username.value}
                                    onChange={(event) => saveOnFieldChange("username", event.target.value)}
                                    onBlur={(event) => validateAndSaveLoginData("username", event.target.value)}
                                    error={formData.username.error}
                                    helperText={formData.username.error && formData.username.errorMessage}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: "30px" }}>
                                <TextField
                                    id="password"
                                    label="Password *"
                                    variant="outlined"
                                    fullWidth
                                    type="password"
                                    value={formData.password.value}
                                    onChange={(event) => saveOnFieldChange("password", event.target.value)}
                                    onBlur={(event) => validateAndSaveLoginData("password", event.target.value)}
                                    error={formData.password.error}
                                    helperText={formData.password.error && formData.password.errorMessage}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: "30px" }}>
                                <Button variant="contained" color="primary" fullWidth onClick={validateAndLoginData}>
                                    SIGN IN
                                </Button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'left', marginTop: "30px" }}>
                                <Link to="/signup">
                                    <Typography variant="body1">
                                        Don't have an account? Sign Up
                                    </Typography>
                                </Link>
                            </div>
                        </Grid>
                        <Grid item xs={4} />
                    </Grid>
                </Grid>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={busy}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Box>
        );
    } else {
        return <Navigate to="/home" />;
    }
};

export default Login;
