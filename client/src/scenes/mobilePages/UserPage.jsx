import { useCallback, useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import UserWidget from "scenes/widgets/UserWidget";
import { fetchUser } from "API";
import useComponentVisible from "hooks/useComponentVisible";
import AuthDataChangeForm from "components/AuthDataChangeForm";
import CustomButton from "components/CustomButton";

const UserPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const userId = useSelector((state) => state.auth.user._id);
  const userFriends = useSelector((state) => state.auth.user.friends);
  const token = useSelector((state) => state.auth.token);
  const [user, setUser] = useState(null);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false, true);

  const getUserData = useCallback(
    async (signal) => {
      const data = await fetchUser(userId, token, signal);
      setUser(data);
    },
    [userId, token]
  );

  const handleModalClosing = (changeSuccess) => {
    if (changeSuccess) setIsComponentVisible(false);
  };

  useEffect(() => {
    const abortController = new AbortController();
    getUserData(abortController.signal);
    return () => {
      abortController.abort();
    };
  }, [getUserData, userFriends]);

  if (!user) return null;

  return (
    <>
      <Box
        width="100%"
        p="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget viewedUserData={user} />
        </Box>
      </Box>
      {isComponentVisible ? (
        <Box
          sx={{
            position: "fixed",
            zIndex: "100",
            backgroundColor: "#7f979ebf",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AuthDataChangeForm
            refProp={ref}
            onChangeSuccess={handleModalClosing}
          />
        </Box>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CustomButton onClick={() => setIsComponentVisible(true)}>
            Change auth data
          </CustomButton>
        </Box>
      )}
    </>
  );
};

export default UserPage;
