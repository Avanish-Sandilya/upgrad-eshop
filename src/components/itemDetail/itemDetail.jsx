import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material';

const ItemDetail = ({ quantity, product }) => {
    const theme = useTheme();

    return (
        <Card sx={{ width: '80%' }}>
            <CardContent>
                <Grid container style={{ paddingTop: '5%', paddingBottom: '5%' }}>
                    <Grid item xs={4} />
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography variant="h4">{product.name}</Typography>
                            </Grid>
                            <Grid item xs={12} style={{ paddingTop: '2%' }}>
                                <Typography variant="body1" style={{ fontSize: '15px' }}>
                                    Quantity: <b>{quantity}</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ paddingTop: '2%' }}>
                                <Typography variant="body1" style={{ fontSize: '15px' }}>
                                    Category: <b>{product.category}</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ paddingTop: '2%' }}>
                                <Typography
                                    variant="body1"
                                    style={{ fontSize: '15px', color: theme.palette.disabled.main }}
                                >
                                    <em>{product.description}</em>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ paddingTop: '2%' }}>
                                <Typography
                                    variant="body1"
                                    style={{ fontSize: '25px', color: theme.palette.secondary.main }}
                                >
                                    Total Price: &#8377; {product.price * quantity}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ItemDetail;
