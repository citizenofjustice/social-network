import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  EditOutlined,
  BorderColor,
  Delete,
  SendRounded,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  InputBase,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useSelector } from "react-redux";
import { patchPostLikes, addCommentToPost } from "API";
import SkeletonLoad from "components/SkeletonLoad";
import DropdownMenu from "components/DropdownMenu";
import UserImage from "components/UserImage";

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
  const [isComments, setIsComments] = useState(false);
  const [commentText, setCommentText] = useState("");
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
  const light = palette.neutral.light;

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

  const handleComment = async () => {
    const formData = new FormData();
    formData.append("userId", loggedInUserId);
    formData.append("commentText", commentText);
    const post = await addCommentToPost(postId, formData, token);
    setCommentText("");
    console.log(post);
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
      <Typography color={main} sx={{ mt: "1rem" }}>
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
            <IconButton onClick={() => setIsComments(!isComments)}>
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

      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment) => (
            <Box key={comment._id}>
              <Divider sx={{ margin: "1rem 0" }} />
              <Box display="flex" justifyContent="flex-start">
                <Box
                  display="flex"
                  backgroundColor={light}
                  padding="0.5rem 1rem 0.5rem 0.75rem"
                  borderRadius="35px"
                >
                  <UserImage image={comment.userPicturePath} size="35px" />
                  <Box ml="0.5rem">
                    <Typography fontSize="0.8rem">
                      {comment.userName}
                    </Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: medium }}>
                      {new Date(comment.createdAt).toLocaleString(locale, {
                        timezone,
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Typography
                sx={{ color: main, m: "0.5rem 0", p: "0.25rem 0.25rem 0 " }}
              >
                {comment.commentText}
              </Typography>
            </Box>
          ))}
          <Divider sx={{ margin: "0.75rem 0" }} />
          <Box>
            <InputBase
              placeholder="What's on your mind..."
              inputProps={{
                className: "add-post-input",
              }}
              onChange={(e) => setCommentText(e.target.value)}
              value={commentText}
              multiline={true}
              maxRows={3}
              sx={{
                width: "100%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "0.75rem",
              }}
            />
            <Box sx={{ display: "inline-block", marginLeft: "-2.5rem" }}>
              <IconButton
                onClick={handleComment}
                style={{ backgroundColor: "transparent" }}
              >
                <SendRounded />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
