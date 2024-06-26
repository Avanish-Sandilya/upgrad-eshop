//Home page for user after login

import Grid from "@mui/material/Grid";
import useAuthentication from "../../hooks/useAuthentication";
import {useContext} from "react";
import ProductCategory from "../productCategory/ProductCategory";
import Box from "@mui/material/Box";
import ProductSorting from "../productSorting/productSorting";
import ProductListing from "../productListing/productListing";

const Home = () => {
    const { AuthCtx } = useAuthentication();
    const { hasRole } = useContext(AuthCtx);
    const currentMode = hasRole(['ADMIN']) ? 'EDIT' : 'VIEW';

   
    const jsxStructure = (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
                <Grid container item spacing={3}>
                    <Grid item xs={12}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <ProductCategory />
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{ display: 'flex', justifyContent: 'left', paddingLeft: '1%' }}>
                            <ProductSorting />
                        </div>
                    </Grid>
                    <ProductListing mode={currentMode} />
                </Grid>
            </Grid>
        </Box>
    );

    
    return jsxStructure;
};

export default Home;