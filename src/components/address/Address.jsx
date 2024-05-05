import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Box, Grid, Typography, TextField, Button, Backdrop, CircularProgress, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { createAddress, fetchAllAddresses } from '../../api/addressAPIs';
import { useNavigate } from 'react-router-dom';
import useAuthentication from '../../hooks/useAuthentication';

const Address = ({ callbackFunction, address }) => {
    const initialState = {
        name: { value: '', error: false, errorMessage: null },
        contactNumber: { value: '', error: false, errorMessage: null },
        street: { value: '', error: false, errorMessage: null },
        city: { value: '', error: false, errorMessage: null },
        state: { value: '', error: false, errorMessage: null },
        landmark: { value: '', error: false, errorMessage: null },
        zipcode: { value: '', error: false, errorMessage: null },
    };

    const [formData, setFormData] = useState(initialState);
    const [selectedAddress, setSelectedAddress] = useState(address ? address.id : '');
    const [busy, setBusy] = useState(false);
    const { AuthCtx } = useAuthentication();
    const { loggedInUserId, accessToken, isAccessTokenValid, logout } = useContext(AuthCtx);
    const [addressList, setAddressList] = useState([]);
    const navigate = useNavigate();
    const [showInfo, setShowInfo] = useState(false);
    const [showMessage, setShowMessage] = useState('');
    const [showMessageLevel, setShowMessageLevel] = useState('error');

    const hideAndResetMessage = () => {
        setShowInfo(false);
        setShowMessage('');
        setShowMessageLevel('error');
    };

    const validateAndPersistData = () => {
        setBusy(true);
        let data = { ...formData };
        let requestJson = { user: loggedInUserId };
        let validAddress = true;
        for (let field in formData) {
            let { valid, message } = getValidity(field, formData[field].value);
            data[field] = { ...data[field], error: !valid, errorMessage: message };
            validAddress = validAddress && valid;
            if (valid) {
                requestJson[field] = data[field].value;
            }
        }
        setFormData(data);
        if (validAddress) {
            if (isAccessTokenValid()) {
                createAddress(requestJson, accessToken)
                    .then(() => {
                        setShowInfo(true);
                        setShowMessage('Address saved successfully.');
                        setShowMessageLevel('success');
                        setBusy(false);
                        setFormData(initialState);
                        initDropdown();
                    })
                    .catch(error => {
                        setShowInfo(true);
                        setShowMessage(error.reason);
                        setShowMessageLevel('error');
                        setBusy(false);
                    });
            } else {
                setShowInfo(true);
                setShowMessage('Session expired. Please login again!');
                setShowMessageLevel('info');
                logout().then(() => {
                    navigate('/login');
                });
            }
        } else {
            setBusy(false);
        }
    };

    const getValidity = (field, value) => {
        let valid = true;
        let message = null;
        if (!value || value.trim().length === 0) {
            if (field !== 'landmark') {
                valid = false;
                message = 'This field is required.';
            }
        } else {
            switch (field) {
                case 'name':
                    valid = /^[A-Za-z\s]+$/.test(value) && value.length <= 255;
                    message = 'Please enter valid name.';
                    break;
                case 'contactNumber':
                    valid = /^[7-9]{1}[0-9]{9}$/.test(value);
                    message = 'Please enter valid contact number.';
                    break;
                case 'street':
                    valid = /^[A-Za-z0-9,/\s\\-_@]+$/.test(value) && value.length <= 255;
                    message = 'Please enter valid street.';
                    break;
                case 'city':
                    valid = /^[A-Za-z]+$/.test(value) && value.length <= 255;
                    message = 'Please enter valid city.';
                    break;
                case 'state':
                    valid = /^[A-Za-z\s]+$/.test(value) && value.length <= 255;
                    message = 'Please enter valid state.';
                    break;
                case 'landmark':
                    valid = /^[A-Za-z0-9,/\s\\-_@]+$/.test(value) && value.length <= 255;
                    message = 'Please enter valid landmark.';
                    break;
                case 'zipcode':
                    valid = /^[1-9]{1}[0-9]{5}$/.test(value);
                    message = 'Please enter valid zip code.';
                    break;
                default:
                    return;
            }
        }
        return { valid, message };
    };

    const saveOnChange = (field, value) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: { ...prevState[field], value }
        }));
    };

    const handleChange = (event) => {
        const { value } = event.target;
        setSelectedAddress(value);
        const selected = addressList.find(addr => addr.id === value);
        callbackFunction(selected || null);
    };

    const initDropdown = useCallback(() => {
        if (isAccessTokenValid()) {
            fetchAllAddresses(accessToken)
                .then(json => setAddressList(json.data))
                .catch(() => setAddressList([]));
        } else {
            setShowInfo(true);
            setShowMessage('Session expired. Please login again!');
            setShowMessageLevel('info');
            logout().then(() => {
                navigate('/login');
            });
        }
    }, [accessToken, isAccessTokenValid, navigate, logout]);

    useEffect(() => {
        initDropdown();
    }, [initDropdown]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
                <Grid container item spacing={3}>
                    <Grid item xs={12}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <FormControl sx={{ m: 1, width: '60%' }}>
                                <InputLabel id="demo-simple-select-label">Select Address</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedAddress}
                                    label="Select Address"
                                    onChange={handleChange}
                                >
                                    {(addressList.length === 0) &&
                                        <MenuItem disabled value="">
                                            No address saved
                                        </MenuItem>
                                    }
                                    {addressList.map((element, index) => (
                                        <MenuItem key={`address_${index}`} value={element.id}>
                                            {`${element.name}, Contact Number : ${element.contactNumber}`}
                                            <br />
                                            {element.landmark ? `${element.street}, ${element.landmark}` : `${element.street}`}
                                            <br />
                                            {`${element.city}, ${element.state}, ${element.zipcode}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography
                                variant="subtitle1"
                                noWrap
                                sx={{
                                    fontSize: '15px',
                                    color: 'inherit',
                                }}
                            >
                                OR
                            </Typography>
                        </div>
                    </Grid>
                </Grid>
                <Grid container item spacing={3}>
                    <Grid item xs={4} />
                    <Grid item xs={4}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography
                                variant="subtitle1"
                                noWrap
                                sx={{
                                    fontSize: '25px',
                                    color: 'inherit',
                                }}
                            >
                                Add Address
                            </Typography>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                            {Object.entries(formData).map(([field, data], index) => (
                                <TextField
                                    key={index}
                                    id={field}
                                    label={`${field.charAt(0).toUpperCase()}${field.slice(1)}${data.error ? ' *' : ''}`}
                                    variant="outlined"
                                    fullWidth
                                    value={data.value}
                                    onChange={(event) => saveOnChange(field, event.target.value)}
                                    onBlur={(event) => validateAndPersistData(field, event.target.value)}
                                    error={data.error}
                                    helperText={data.error && data.errorMessage}
                                />
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={validateAndPersistData}
                            >
                                SAVE ADDRESS
                            </Button>
                        </div>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={busy}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={showInfo}
                autoHideDuration={4000}
                onClose={hideAndResetMessage}
            >
                <Alert onClose={hideAndResetMessage} severity={showMessageLevel} sx={{ width: '100%' }}>
                    {showMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Address;
