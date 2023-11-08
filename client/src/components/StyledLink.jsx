import { Link } from "react-router-dom";

const StyledLink = (props) => {
  return (
    <Link
      to={props.path}
      style={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        color: "inherit",
      }}
    >
      {props.children}
    </Link>
  );
};

export default StyledLink;
