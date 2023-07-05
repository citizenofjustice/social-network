import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import React, { useEffect, useMemo, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "theme";
import { setDateTimeFormat } from "state/uiSlice";
import { Box, CircularProgress } from "@mui/material";
import SearchPage from "scenes/mobilePages/SearchPage";
import FriendListPage from "scenes/mobilePages/FriendListPage";
import FeedPage from "scenes/mobilePages/FeedPage";
import UserPage from "scenes/mobilePages/UserPage";
import MyPostPage from "scenes/mobilePages/MyPostPage";
import Layout from "components/Layout";

const HomePage = lazy(() => import("scenes/homePage"));
const LoginPage = lazy(() => import("scenes/loginPage"));
const ProfilePage = lazy(() => import("scenes/profilePage"));

function App() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.ui.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.auth.token));
  const isNonMobileScreen = useMediaQuery("(min-width: 1000px");

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    dispatch(setDateTimeFormat({ timezone, locale }));
  }, [dispatch]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Suspense
            fallback={
              <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress />
              </Box>
            }
          >
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route
                path="/"
                element={isAuth ? <Layout /> : <Navigate to="/" />}
              >
                <Route path="/home" element={<HomePage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route
                  path="/feed"
                  element={!isNonMobileScreen ? <FeedPage /> : <HomePage />}
                />
                <Route
                  path="/friends"
                  element={
                    !isNonMobileScreen ? <FriendListPage /> : <HomePage />
                  }
                />
                <Route
                  path="/search"
                  element={!isNonMobileScreen ? <SearchPage /> : <HomePage />}
                />
                <Route
                  path="/user"
                  element={!isNonMobileScreen ? <UserPage /> : <HomePage />}
                />
                <Route
                  path="/myposts"
                  element={!isNonMobileScreen ? <MyPostPage /> : <HomePage />}
                />
              </Route>
            </Routes>
          </Suspense>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
