import { Alert, Box, Collapse } from "@mui/material";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Navbar from "scenes/navbar";
import { TransitionGroup } from "react-transition-group";

/**
 * Component for correct conditional routing, always keeps navigation in
 * @returns layout of page
 */
const Layout = () => {
  const { items } = useSelector((state) => state.ui.errors);

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
            marginBottom: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            zIndex: "100",
          }}
        >
          <TransitionGroup>
            {items.length > 0 &&
              items.map((error) => (
                <Collapse key={error.id}>
                  <Alert
                    variant="filled"
                    severity="error"
                    sx={{ margin: "0.25rem 0" }}
                  >
                    {error.text}
                  </Alert>
                </Collapse>
              ))}
          </TransitionGroup>
        </Box>
      </main>
    </>
  );
};

export default Layout;
