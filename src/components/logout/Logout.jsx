//Logout button component

import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import useAuthentication from "../../hooks/useAuthentication";
import {clearAllMetadata} from "../../store/actions/metadataAction";
import {connect} from "react-redux";

const Logout = ({ sx, resetMetadata }) => {
    const { logout } = useAuthentication();
    const navigate = useNavigate();

    // Set default value for sx
    if (!sx) {
        sx = {};
    }

    // Function to handle logout
    const performLogout = () => {
        resetMetadata(); // Reset metadata (if needed)
        logout()
            .then(() => {
                navigate("/login"); // Redirect to login page
            })
            .catch((error) => {
                console.error("Logout failed:", error);
                // Handle logout error, if necessary
            });
    };

    return (
        <Button
            sx={sx}
            variant="contained"
            color="secondary"
            onClick={performLogout}
        >
            LOGOUT
        </Button>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetMetadata: () => dispatch(clearAllMetadata()),
    };
};

export default connect(null, mapDispatchToProps)(Logout);