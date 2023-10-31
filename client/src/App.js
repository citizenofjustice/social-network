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
import ProtectedRoutes from "components/ProtectedRoutes";

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
              <Route path="/" element={<Layout />}>
                <Route
                  path="login"
                  element={
                    <ProtectedRoutes allowed={!isAuth} path="/">
                      <LoginPage />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  index
                  element={
                    <ProtectedRoutes allowed={isAuth}>
                      {isNonMobileScreen ? (
                        <HomePage />
                      ) : (
                        <Navigate to="/feed" replace />
                      )}
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="profile/:userId"
                  element={
                    <ProtectedRoutes allowed={isAuth}>
                      <ProfilePage />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="feed"
                  element={
                    <ProtectedRoutes allowed={isAuth}>
                      {!isNonMobileScreen ? (
                        <FeedPage />
                      ) : (
                        <Navigate to="/" replace />
                      )}
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="friends"
                  element={
                    <ProtectedRoutes allowed={isAuth}>
                      {!isNonMobileScreen ? (
                        <FriendListPage />
                      ) : (
                        <Navigate to="/" replace />
                      )}
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="search"
                  element={
                    <ProtectedRoutes allowed={isAuth}>
                      {!isNonMobileScreen ? (
                        <SearchPage />
                      ) : (
                        <Navigate to="/" replace />
                      )}
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="user"
                  element={
                    <ProtectedRoutes allowed={isAuth}>
                      {!isNonMobileScreen ? (
                        <UserPage />
                      ) : (
                        <Navigate to="/" replace />
                      )}
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="myposts"
                  element={
                    <ProtectedRoutes allowed={isAuth}>
                      {!isNonMobileScreen ? (
                        <MyPostPage />
                      ) : (
                        <Navigate to="/" replace />
                      )}
                    </ProtectedRoutes>
                  }
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
