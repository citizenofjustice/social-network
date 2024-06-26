import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import React, { useEffect, useMemo, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "theme";
import { setDateTimeFormat } from "state/uiSlice";
import Layout from "components/Layout";
import ProtectedRoutes from "components/ProtectedRoutes";
import { QueryClient, QueryClientProvider } from "react-query";
import CustomCircularLoading from "components/CustomCircularLoading";

const HomePage = lazy(() => import("scenes/homePage"));
const AuthPage = lazy(() => import("scenes/AuthPage"));
const ProfilePage = lazy(() => import("scenes/profilePage"));
const PostPageDesktop = lazy(() => import("scenes/postPage"));
const SearchPage = lazy(() => import("scenes/mobilePages/SearchPage"));
const FriendListPage = lazy(() => import("scenes/mobilePages/FriendListPage"));
const FeedPage = lazy(() => import("scenes/mobilePages/FeedPage"));
const UserPage = lazy(() => import("scenes/mobilePages/UserPage"));
const PostPage = lazy(() => import("scenes/mobilePages/PostPage"));

// Create a client
const queryClient = new QueryClient();

function App() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.ui.mode);
  let theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.auth.token));
  const isNonMobileScreen = useMediaQuery("(min-width: 1000px");

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    dispatch(setDateTimeFormat({ timezone, locale }));
  }, [dispatch]);

  return (
    <div className="app" style={{ backgroundColor: theme.palette.custom.body }}>
      {/* Provide the client to your App */}
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Suspense fallback={<CustomCircularLoading margin="4rem 0 0 0" />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route
                    path="login"
                    element={
                      <ProtectedRoutes allowed={!isAuth} path="/">
                        <AuthPage />
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
                    path="post/*"
                    element={
                      <ProtectedRoutes allowed={isAuth}>
                        {isNonMobileScreen ? <PostPageDesktop /> : <PostPage />}
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
                </Route>
              </Routes>
            </Suspense>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
