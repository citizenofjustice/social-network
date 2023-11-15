import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Navbar from "scenes/navbar";
import AlertMessage from "./AlertMessage";

/**
 * Component for correct conditional routing, always keeps navigation in
 * @returns layout of page
 */
const Layout = () => {
  const message = useSelector((state) => state.ui.message);

  return (
    <>
      <Navbar />
      <main
        style={{
          position: "absolute",
          top: "5rem",
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "auto",
        }}
      >
        <Outlet />
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            zIndex: "100",
          }}
        >
          {message.isShown && (
            <AlertMessage text={message.text} alertType={message.type} />
          )}
        </Box>
      </main>
    </>
  );
};

export default Layout;
