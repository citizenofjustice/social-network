import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import LazyImage from "components/LazyImage";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <LazyImage
        image={{
          src: `${process.env.REACT_APP_API_URL}assets/info4.jpeg`,
          placeholderSrc: `${process.env.REACT_APP_API_URL}assets/info4-placeholder.jpeg`,
          alt: "advertisement picture",
          width: "100%",
          height: "auto",
          style: {
            borderRadius: "0.75rem",
            margin: "0.75rem 0",
            aspectRatio: "150/100",
          },
        }}
      />
      <FlexBetween>
        <Typography color={main}>MikaCosmetics</Typography>
        <Typography color={medium}>mikacosmetics.com</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        Get your pathway to stunning and immaculate beauty and made sure your
        skin is exfoliating and shining like light.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
