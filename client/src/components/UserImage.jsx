import { Box } from "@mui/material";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UserImage = ({ image, size = "60px", loading }) => {
  return (
    <Box width={size} height={size}>
      {loading && <Skeleton circle width={size} height={size} />}
      <img
        style={{
          objectFit: "cover",
          borderRadius: "50%",
          display: loading ? "none" : undefined,
        }}
        width={size}
        height={size}
        alt="user"
        src={`http://localhost:3001/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
