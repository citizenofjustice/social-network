import { Box } from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LazyImage = ({ image }) => {
  return (
    <Box sx={image.alignStyle}>
      <LazyLoadImage
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        style={image.style}
        effect="blur"
        placeholderSrc={image.placeholderSrc}
        wrapperProps={{
          style: {
            width: "100%",
            height: "100%",
          },
        }}
      />
    </Box>
  );
};

export default LazyImage;
