// color design tokens export
// export const colorTokens = {
//   primary: {

//   },
// };

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            body: "#252525",
            background: "#4B4B4B",
            text: "#E9E9E9",
            largeText: "#FFFFFF",
            controls: "#50A4A9",
            controlsText: "#FFFFFF",
            hoveredControls: "#158288",
            placeholderBackground: "#087F87",
          }
        : {
            // palette values for light mode
            body: "#C0C0C0",
            background: "#F8F8F8",
            text: "#595959",
            largeText: "#333333",
            controls: "#50A4A9",
            controlsText: "#FFFFFF",
            hoveredControls: "#158288",
            placeholderBackground: "#087F87",
          }),
    },
    typography: {
      fontFamily: ["Rubik", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
