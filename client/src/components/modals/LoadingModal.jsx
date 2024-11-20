import React from "react";
import { Modal, Box, CircularProgress } from "@mui/material";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

const LoadingModal = ({ isOpen }) => {
    return (
        <Modal open={isOpen}>
            <Box sx={{ ...style, backgroundColor: "transparent", boxShadow: "none" }}>
                <CircularProgress color="secondary" />
            </Box>
        </Modal>
    );
};

export default LoadingModal;
