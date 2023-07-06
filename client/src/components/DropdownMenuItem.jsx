import FlexBetween from "./FlexBetween";
import { getEditablePostData, removeSelectedPost } from "API";
import { Typography, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { triggerReloadToggle, setEditablePost } from "state/postsSlice";

const DropdownMenuItem = ({ menuItem, postId }) => {
  const token = useSelector((state) => state.auth.token);
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const dispatch = useDispatch();

  const handleMenuItemClick = async () => {
    if (menuItem.type === "EDIT") {
      const editablePost = await getEditablePostData(
        postId,
        token,
        loggedInUserId
      );
      dispatch(setEditablePost({ editablePost }));
    }
    if (menuItem.type === "REMOVE") {
      const response = await removeSelectedPost(postId, token, loggedInUserId);
      if (response.ok) dispatch(triggerReloadToggle());
    }
  };

  return (
    <>
      <FlexBetween
        onClick={handleMenuItemClick}
        sx={{ margin: "0.3125rem 0", justifyContent: "flex-start" }}
      >
        {menuItem.icon}
        <Typography sx={{ marginLeft: "0.5rem", whiteSpace: "nowrap" }}>
          {menuItem.text}
        </Typography>
      </FlexBetween>
      <Divider sx={{ height: "1px", width: "100%" }} />
    </>
  );
};

export default DropdownMenuItem;
