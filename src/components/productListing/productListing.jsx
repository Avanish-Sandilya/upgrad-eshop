import { useEffect, useState, useContext } from "react";
import { Modal, Box, Button, Backdrop, CircularProgress, Typography, Grid } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { connect } from "react-redux";
import { initCatalog } from "../../store/actions/metadataAction";
import { deleteProduct, viewProduct } from "../../api/productAPIs";
import useAuthentication from "../../hooks/useAuthentication";
import useServices from "../../hooks/useServices";
import ProductCard from "../productCard/ProductCard";

const ProductListing = ({mode, productList, sortBy, category, reFetchAllData }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [product, setProduct] = useState(null);
  const { AuthCtx } = useAuthentication();
  const { accessToken, isAccessTokenValid, logout } = useContext(AuthCtx);
  const [busy, setBusy] = useState(false);
  const { ServicesCtx } = useServices();
  const { broadcastMessage } = useContext(ServicesCtx);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchFor = searchParams.get("searchFor") || "";

  useEffect(() => {
    reFetchAllData(accessToken);
  }, [accessToken, reFetchAllData]);

  const getFilteredProductsBasedOnQuery = (list, str) => {
    return str ? list.filter(item => item.name.toUpperCase().startsWith(str.toUpperCase())) : list;
  };

  const getSortedProducts = (list, sortBy) => {
    return list.slice().sort((a, b) => {
      switch (sortBy) {
        case "PRICE_ASC":
          return a.price - b.price;
        case "PRICE_DESC":
          return b.price - a.price;
        default:
          return 0;
      }
    });
  };

  const getFilteredProducts = (list, category) => {
    return category === "ALL" ? list : list.filter(item => item.category.toUpperCase() === category.toUpperCase());
  };

  const initiateDeleteProduct = details => {
    setProduct(details);
    setDeleteModal(true);
  };

  const initiateModifyProduct = details => {
    navigate("/product/modify", { state: JSON.stringify({ value: details }) });
  };

  const initiateViewProduct = details => {
    if (isAccessTokenValid()) {
      setBusy(true);
      viewProduct(details.id, accessToken)
        .then(json => {
          navigate("/product/view", { state: JSON.stringify({ value: json.value }) });
          setBusy(false);
        })
        .catch(json => {
          broadcastMessage(json.reason, "error");
          setBusy(false);
        });
    } else {
      broadcastMessage("Session expired. Please login again!", "info");
      logout().then(() => navigate("/login"));
    }
  };

  const handleClose = () => {
    setProduct(null);
    setDeleteModal(false);
  };

  const proceedDelete = () => {
    setBusy(true);
    setDeleteModal(false);
    if (isAccessTokenValid()) {
      deleteProduct(product.id, accessToken)
        .then(() => {
          broadcastMessage(`Product ${product.name} deleted successfully.`, "success");
          setBusy(false);
          setProduct(null);
          reFetchAllData(accessToken);
        })
        .catch(json => {
          broadcastMessage(json.reason, "error");
          setBusy(false);
          setProduct(null);
        });
    } else {
      broadcastMessage("Session expired. Please login again!", "info");
      logout().then(() => navigate("/login"));
    }
  };

  const filteredProducts = getFilteredProductsBasedOnQuery(
    getSortedProducts(getFilteredProducts(productList, category), sortBy),
    searchFor
  );

  return (
    <>
      <Grid container>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((element, index) => (
            <Grid key={"parent_product_" + index} item xs={4}>
              <div key={"div_product_" + index} style={{ display: 'flex', justifyContent: 'center', marginTop: "10%" }}>
                <ProductCard
                  key={"product_" + index}
                  mode={mode}
                  deleteProduct={initiateDeleteProduct}
                  modifyProduct={initiateModifyProduct}
                  buyProduct={initiateViewProduct}
                  {...element}
                />
              </div>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant="body1">No products available.</Typography>
            </div>
          </Grid>
        )}
      </Grid>
      <Modal
        open={deleteModal}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            pt: 2,
            px: 4,
            pb: 3
          }}
        >
          <h2 id="parent-modal-title">Confirm deletion of product!</h2>
          <p id="parent-modal-description">Are you sure you want to delete the product?</p>
          <Button onClick={handleClose} variant={"outlined"} style={{ float: "right", marginLeft: 10 }}>Cancel</Button>
          <Button onClick={proceedDelete} variant={"contained"} style={{ float: "right", marginLeft: 10 }}>Ok</Button>
        </Box>
      </Modal>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={busy}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    productList: state.metadata.products,
    sortBy: state.metadata.selectedSortBy,
    category: state.metadata.selectedCategory,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reFetchAllData: (accessToken) => dispatch(initCatalog(accessToken)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductListing);
