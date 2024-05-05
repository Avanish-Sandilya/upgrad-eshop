import React, { useContext, useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import useServices from '../../hooks/useServices';

const BroadcastMessage = () => {
    const { ServicesCtx } = useServices();
    const { message, level, broadcastMessage } = useContext(ServicesCtx);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        setShowInfo(message !== null && level !== null);
    }, [message, level]);

    const hideAndResetMessage = () => {
        setShowInfo(false);
        broadcastMessage(null, null);
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={showInfo}
            autoHideDuration={4000}
            onClose={hideAndResetMessage}
        >
            <Alert onClose={hideAndResetMessage} severity={level} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default BroadcastMessage;
