import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  EditOutlined,
  BorderColor,
  Delete,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useSelector } from "react-redux";
import { patchPostLikes } from "API";
import SkeletonLoad from "components/SkeletonLoad";
import DropdownMenu from "components/DropdownMenu";
import CommentsList from "components/CommentsList";
import LazyImage from "components/LazyImage";
import CopyLink from "components/CopyLink";
import useComponentVisible from "hooks/useComponentVisible";
import FlexCentered from "components/FlexCenterd";

const PostWidget = ({
  postId,
  postUserId,
  createdAt,
  updatedAt,
  firstName,
  lastName,
  description,
  location,
  picturePath,
  aspectRatio,
  userPicturePath,
  likes,
  comments,
  isEdited,
  displayComments = false,
}) => {
  const [isCommentsShown, setIsCommentsShown] = useState(displayComments);
  const [shareLink, setShareLink] = useState("");
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const token = useSelector((state) => state.auth.token);
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const [postLikes, setPostLikes] = useState(likes);
  const [commentsCounter, setCommentCounter] = useState(comments.length);
  const likesCount = Object.keys(postLikes).length;
  const isLiked = Boolean(postLikes[loggedInUserId]);
  const isMyPost = postUserId === loggedInUserId;
  const isMobile = useMediaQuery("(max-width: 375px");

  const { timezone, locale } = useSelector((state) => state.ui.dateTimeFormat);
  const postCreateDate = new Date(createdAt).toLocaleString(locale, {
    timezone,
  });

  const { palette } = useTheme();
  const { text, lightText } = palette.custom;

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

  const handleCommentsCounterChange = (counter) => {
    setCommentCounter(counter);
  };

  const handleCopyLinkShow = (shareData) => {
    const { state, link } = shareData;
    setIsComponentVisible(state);
    setShareLink(link);
  };

  const handleCopyIconClick = (state) => {
    setIsComponentVisible(state);
  };

  const postDate = postCreateDate.split(" ");

  return (
    <WidgetWrapper mb="2rem" position="relative">
      <Box display="flex">
        <Friend
          friendId={postUserId}
          firstName={firstName}
          lastName={lastName}
          subtitle={location}
          userPicturePath={userPicturePath}
          style={{ flexBasis: "100%", marginRight: "0.5rem" }}
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
              onShareLink={handleCopyLinkShow}
            />
          </Box>
        }
      </Box>
      {isComponentVisible && (
        <Box
          ref={ref}
          width="100%"
          sx={{
            position: "absolute",
            zIndex: "5",
            top: "1.5rem",
            right: "1rem",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <CopyLink link={shareLink} onCopy={handleCopyIconClick} />
        </Box>
      )}
      <Typography color={text} sx={{ m: "0.5rem 0", whiteSpace: "pre-line" }}>
        <SkeletonLoad>{description}</SkeletonLoad>
      </Typography>
      {picturePath && (
        <LazyImage
          image={{
            src: picturePath.sourceUrl,
            placeholderSrc: picturePath.placeholderUrl,
            alt: "post picture",
            width: "100%",
            height: "auto",
            style: {
              borderRadius: "0.75rem",
              aspectRatio: aspectRatio,
            },
          }}
        />
      )}

      <FlexBetween mt="0.25rem">
        <FlexCentered gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton sx={{ color: text }} onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined
                  sx={{ fontSize: isMobile ? "1rem" : "1.5rem" }}
                />
              ) : (
                <FavoriteBorderOutlined
                  sx={{ fontSize: isMobile ? "1rem" : "1.5rem" }}
                />
              )}
            </IconButton>
            <Typography>{likesCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsCommentsShown(!isCommentsShown)}>
              <ChatBubbleOutlineOutlined
                sx={{ fontSize: isMobile ? "1rem" : "1.5rem" }}
              />
            </IconButton>
            <Typography>{commentsCounter}</Typography>
          </FlexBetween>
        </FlexCentered>

        <FlexBetween>
          {isEdited && (
            <EditOutlined
              sx={{ color: text, marginRight: "0.25rem" }}
              fontSize="0.4rem"
            />
          )}
          <Box>
            {isMobile ? (
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.65rem",
                    color: lightText,
                  }}
                >
                  {postDate[0]}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.65rem",
                    color: lightText,
                  }}
                >
                  {postDate[1]}
                </Typography>
              </Box>
            ) : (
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  color: lightText,
                }}
              >
                {postCreateDate}
              </Typography>
            )}
          </Box>
        </FlexBetween>
      </FlexBetween>

      <CommentsList
        postId={postId}
        comments={comments}
        isShown={isCommentsShown}
        onCounterChange={handleCommentsCounterChange}
      />
    </WidgetWrapper>
  );
};

export default PostWidget;
