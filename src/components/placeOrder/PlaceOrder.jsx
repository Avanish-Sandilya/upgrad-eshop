import React, { useCallback, useContext, useEffect, useState } from "react";
import { Box, Button, Grid, Snackbar } from "@mui/material";
import { Step, StepLabel, Stepper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthentication from "../../hooks/useAuthentication";
import Address from "../address/Address";
import OrderDetails from "../orderDetails/OrderDetails";
import { createOrder } from "../../api/orderAPIs";
import useServices from "../../hooks/useServices";
import ItemDetail from "../itemDetail/itemDetail";
import Alert from "@mui/material/Alert";
import NavigationBar from "../navigationBar/NavigationBar";

const PlaceOrder = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const [showMessageLevel, setShowMessageLevel] = useState("error");
  const [activeStep, setActiveStep] = useState(0);
  const [orderDetails, setOrderDetails] = useState({
    quantity: null,
    user: null,
    product: null,
    address: null,
    addressObject: null,
  });
  const { ServicesCtx } = useServices();
  const { broadcastMessage } = useContext(ServicesCtx);
  const { AuthCtx } = useAuthentication();
  const { loggedInUserId, accessToken, isAccessTokenValid, logout } = useContext(AuthCtx);
  const navigate = useNavigate();
  const location = useLocation();
  const json = location.state && JSON.parse(location.state);

  const initPageData = useCallback((data = json) => {
    if (!data || !data.product?.id || !data.quantity) {
      broadcastMessage("Invalid access. Redirecting to home...", "warning");
      navigate("/home");
    } else {
      setOrderDetails({
        ...orderDetails,
        quantity: data.quantity,
        user: loggedInUserId,
        product: data.product.id,
      });
    }
  }, [json, navigate, broadcastMessage, loggedInUserId, orderDetails]);

  useEffect(() => {
    initPageData();
  }, [initPageData]);

  const hideAndResetMessage = () => {
    setShowInfo(false);
    setShowMessage("");
    setShowMessageLevel("error");
  };

  const saveAddressForDelivery = (obj) => {
    setOrderDetails({ ...orderDetails, address: obj?.id, addressObject: obj });
  };

  const moveToPreviousStep = () => {
    if (activeStep === 0) {
      navigate("/product/view", { state: JSON.stringify({ value: json.product }) });
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  const validateAndMoveToNextStep = () => {
    let moveToNext = true;
    if (activeStep === 1 && !orderDetails.address) {
      setShowInfo(true);
      setShowMessage("Please select an address!");
      setShowMessageLevel("error");
      moveToNext = false;
    }

    if (moveToNext) {
      setActiveStep(activeStep + 1);
    } else {
      setActiveStep(activeStep);
    }
  };

  const confirmAndPlaceOrder = () => {
    if (isAccessTokenValid()) {
      createOrder(orderDetails, accessToken)
        .then(() => {
          broadcastMessage("Order placed successfully!", "success");
          navigate("/home");
        })
        .catch((error) => {
          broadcastMessage(error.reason, "error");
        });
    } else {
      broadcastMessage("Session expired. Please login again!", "info");
      logout().then(() => {
        navigate("/login");
      });
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavigationBar />
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <Stepper activeStep={activeStep} sx={{ width: "80%" }}>
            {["Items", "Select Address", "Confirm Order"].map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid item xs={12}>
          {activeStep === 0 && (
            <ItemDetail
              productQuantity={orderDetails.quantity}
              selectedProduct={json.product}
            />
          )}
          {activeStep === 1 && (
            <Address
              callbackFunction={saveAddressForDelivery}
              address={orderDetails.addressObject}
            />
          )}
          {activeStep === 2 && (
            <OrderDetails
              quantity={orderDetails.quantity}
              product={json.product}
              address={orderDetails.addressObject}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="text"
            color="disabled"
            onClick={moveToPreviousStep}
            disabled={activeStep === 0}
          >
            BACK
          </Button>
          {(activeStep === 0 || activeStep === 1) && (
            <Button
              variant="contained"
              color="primary"
              onClick={validateAndMoveToNextStep}
            >
              NEXT
            </Button>
          )}
          {activeStep === 2 && (
            <Button
              variant="contained"
              color="primary"
              onClick={confirmAndPlaceOrder}
            >
              PLACE ORDER
            </Button>
          )}
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showInfo}
        autoHideDuration={4000}
        onClose={hideAndResetMessage}
      >
        <Alert
          onClose={hideAndResetMessage}
          severity={showMessageLevel}
          sx={{ width: "100%" }}
        >
          {showMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlaceOrder;
