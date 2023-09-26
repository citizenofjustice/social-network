import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  EditOutlined,
  BorderColor,
  Delete,
} from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useSelector } from "react-redux";
import { patchPostLikes } from "API";
import SkeletonLoad from "components/SkeletonLoad";
import DropdownMenu from "components/DropdownMenu";
import CommentsList from "components/CommentsList";

const PostWidget = ({
  postId,
  postUserId,
  createdAt,
  updatedAt,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  isEdited,
  isPostLoading,
}) => {
  const [isCommentsShown, setIsCommentsShown] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const [postLikes, setPostLikes] = useState(likes);
  const likesCount = Object.keys(postLikes).length;
  const isLiked = Boolean(postLikes[loggedInUserId]);
  const isMyPost = postUserId === loggedInUserId;

  const { timezone, locale } = useSelector((state) => state.ui.dateTimeFormat);
  const postCreateDate = new Date(createdAt).toLocaleString(locale, {
    timezone,
  });

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const medium = palette.neutral.medium;

  const postDropdownMenuItems = [
    {
      icon: <BorderColor />,
      text: "edit post",
      type: "EDIT",
      access: isMyPost,
    },
    { icon: <Delete />, text: "remove post", type: "REMOVE", access: isMyPost },
    {
      icon: <ShareOutlined />,
      text: "share post",
      type: "SHARE",
      access: true,
    },
  ];

  const patchLike = async () => {
    const { likes } = await patchPostLikes(postId, token, loggedInUserId);
    setPostLikes(likes);
  };

  return (
    <WidgetWrapper mb="2rem">
      <Box display="flex">
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
          isContentLoading={isPostLoading}
          style={{ flexBasis: "100%", marginRight: "1rem" }}
        />
        {
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <DropdownMenu
              isMyPost={isMyPost}
              postId={postId}
              menuItems={postDropdownMenuItems}
            />
          </Box>
        }
      </Box>
      <Typography color={main} sx={{ mt: "1rem", whiteSpace: "pre-line" }}>
        <SkeletonLoad loading={isPostLoading}>{description}</SkeletonLoad>
      </Typography>
      <SkeletonLoad loading={isPostLoading} height="15rem">
        {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`http://localhost:3001/assets/${picturePath}`}
          />
        )}
      </SkeletonLoad>

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likesCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsCommentsShown(!isCommentsShown)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween>
          {isEdited && (
            <EditOutlined sx={{ color: medium }} fontSize="0.4rem" />
          )}
          <Typography
            color={main}
            sx={{ fontSize: "0.65rem", color: medium, pl: "0.25rem" }}
          >
            {postCreateDate}
          </Typography>
        </FlexBetween>
      </FlexBetween>

      <CommentsList
        postId={postId}
        comments={comments}
        isShown={isCommentsShown}
      />
    </WidgetWrapper>
  );
};

export default PostWidget;
