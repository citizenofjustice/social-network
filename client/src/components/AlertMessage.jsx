import { forwardRef } from "react";
import { Snackbar, Slide } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { closeMessage } from "state/uiSlice";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function DialogTransition(props) {
  return <Slide direction="up" {...props} />;
}

const AlertMessage = ({ text, alertType }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsOpen(false);
    setTimeout(() => dispatch(closeMessage()), 500);
  };

  return (
    <Snackbar
      open={isOpen}
      TransitionComponent={DialogTransition}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={alertType} sx={{ width: "100%" }}>
        {text}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage;
