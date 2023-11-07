import { Alert, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Navbar from "scenes/navbar";

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
            justifyContent: "center",
            width: "100vw",
          }}
        >
          {items.length > 0 &&
            items.map((error) => (
              <Alert key={error.id} variant="filled" severity="error">
                {error.text}
              </Alert>
            ))}
        </Box>
      </main>
    </>
  );
};

export default Layout;
