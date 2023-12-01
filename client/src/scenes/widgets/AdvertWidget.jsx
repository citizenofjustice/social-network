import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import LazyImage from "components/LazyImage";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const { largeText, text, lightText, controls } = palette.custom;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={largeText} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={lightText}>Create Ad</Typography>
      </FlexBetween>
      <LazyImage
        image={{
          src: `${process.env.REACT_APP_API_URL}assets/advertisement.jpg`,
          placeholderSrc: `${process.env.REACT_APP_API_URL}assets/advertisement-placeholder.jpg`,
          alt: "advertisement picture",
          width: "100%",
          height: "auto",
          style: {
            borderRadius: "0.75rem",
            margin: "0.75rem 0",
            aspectRatio: "150/100",
          },
          alignStyle: {
            margin: "0 auto",
            width: "80%",
          },
        }}
      />
      <FlexBetween>
        <Typography color={text}>NY Coffe</Typography>
        <Typography
          color={text}
          sx={{
            "&:hover": {
              color: controls,
              cursor: "pointer",
            },
          }}
        >
          ny-coffe.com
        </Typography>
      </FlexBetween>
      <Typography color={lightText} m="0.5rem 0">
        Are you looking for a place to relax, enjoy, and savor the best coffee
        in town? Look no further than NYcoffe coffee house, the ultimate
        destination for coffee lovers!
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
