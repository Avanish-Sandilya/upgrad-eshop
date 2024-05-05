import React from 'react';
import Typography from '@mui/material/Typography';
import './Footer.css';

const Footer = () => (
    <footer className="footer">
        <div className="footer-content">
            <Typography variant="body2">
                Copyright © <a href="https://www.upgrad.com/" target="_blank" rel="noopener noreferrer">upGrad</a>
                {' '}
                {new Date().getFullYear()}.
            </Typography>
        </div>
    </footer>
);

export default Footer;
