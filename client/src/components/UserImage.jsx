import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UserImage = ({ image, size = "60px", loading }) => {
  const { palette } = useTheme();
  const { shadow } = palette.custom;
  return (
    <Box width={size} height={size}>
      {loading && <Skeleton circle width={size} height={size} />}
      <img
        style={{
          objectFit: "cover",
          borderRadius: "50%",
          display: loading ? "none" : undefined,
          border: `1px solid ${shadow}`,
        }}
        width={size}
        height={size}
        alt="user"
        src={image.sourceUrl}
      />
    </Box>
  );
};

export default UserImage;
