import { Outlet } from "react-router-dom";
import Navbar from "scenes/navbar";

/**
 * Component for correct conditional routing, always keeps navigation in
 * @returns layout of page
 */
const Layout = () => {
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
      </main>
    </>
  );
};

export default Layout;
