// color design tokens export
export const colorTokens = {
  // primary: {
  //   // main: "#81ACD6",
  //   ligth: "#e3f2fd",
  //   main: "#90caf9",
  //   dark: "#42a5f5",
  // },
};

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            custom: {
              // palette values for dark mode
              body: "#151515",
              background: "#3B3B3B",
              text: "#E9E9E9",
              largeText: "#FFFFFF",
              themedLargeText: "#25B0B8",
              hoveredThemedLargeText: "#4FC8CE",
              controls: "#50A4A9",
              controlsText: "#FFFFFF",
              hoveredControls: "#158288",
              placeholderBackground: "#087F87",
              shadow: "#C8C8C8",
              inputsBackground: "#676767",
            },
          }
        : {
            custom: {
              // palette values for light mode
              body: "#CDCDCD",
              background: "#F8F8F8",
              text: "#595959",
              largeText: "#333333",
              themedLargeText: "#64cbd0",
              hoveredThemedLargeText: "#52b0b5",
              controls: "#50A4A9",
              controlsText: "#FFFFFF",
              hoveredControls: "#158288",
              placeholderBackground: "#087F87",
              shadow: "#9B9B9B",
              inputsBackground: "#DBDBDB",
            },
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
