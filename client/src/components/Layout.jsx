import { Outlet } from "react-router-dom";
import Navbar from "scenes/navbar";

// import styles from "./Layout.module.scss";

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
        <Outlet
          styles={{
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              outline: "1px solid slategrey",
            },
          }}
        />
      </main>
    </>
  );
};

export default Layout;
