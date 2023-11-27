import { SendRounded, Delete } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  InputBase,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import UserImage from "components/UserImage";
import { addCommentToPost, removeCommentFromPost } from "API";
import StyledLink from "./StyledLink";
import DefaultUserIcon from "./DefaultUserIcon";

const CommentsList = ({ postId, comments, isShown, onCounterChange }) => {
  const [commentText, setCommentText] = useState("");
  const [commentList, setCommentList] = useState(comments);
  const token = useSelector((state) => state.auth.token);
  const loggedInUserId = useSelector((state) => state.auth.user._id);

  const { timezone, locale } = useSelector((state) => state.ui.dateTimeFormat);

  const { palette } = useTheme();
  const { largeText, text, inputsBackground } = palette.custom;

  const handleComment = async () => {
    if (commentText.length === 0) return;
    const formData = new FormData();
    formData.append("userId", loggedInUserId);
    formData.append("commentText", commentText);
    const updatedPost = await addCommentToPost(postId, formData, token);
    setCommentList(updatedPost.comments);
    onCounterChange(updatedPost.comments.length);
    setCommentText("");
  };

  const handleRemoveComment = async (id) => {
    const updatedPost = await removeCommentFromPost(
      postId,
      id,
      loggedInUserId,
      token
    );
    if (updatedPost) setCommentList(updatedPost.comments);
    onCounterChange(updatedPost.comments.length);
  };

  return (
    <>
      {isShown && (
        <Box mt="0.5rem">
          {commentList.map((comment) => (
            <Box key={comment._id}>
              <Divider sx={{ margin: "1rem 0" }} />

              <Box display="flex" justifyContent="space-between">
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                >
                  <Box display="flex" flexDirection="column">
                    <StyledLink path={`/profile/${comment.author._id}`}>
                      {comment.author.picturePath ? (
                        <UserImage
                          image={comment.author.picturePath}
                          size="45px"
                        />
                      ) : (
                        <DefaultUserIcon
                          firstNameInitial={comment.author.firstName[0]}
                          lastNameInitial={comment.author.lastName[0]}
                          size="45px"
                          fontSize="1.25rem"
                        />
                      )}
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        backgroundColor={inputsBackground}
                        padding="0.5rem 0.5rem"
                        borderRadius="10px"
                        width="fit-content"
                        height="45px"
                        ml="0.5rem"
                      >
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: "500",
                            color: largeText,
                          }}
                        >
                          {`${comment.author.firstName} ${comment.author.lastName}`}
                        </Typography>
                        <Typography sx={{ fontSize: "0.65rem", color: text }}>
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
                    </StyledLink>
                    <Typography
                      sx={{
                        color: text,
                        m: "0.5rem 0",
                        p: "0.25rem 0.25rem 0 ",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {comment.content}
                    </Typography>
                  </Box>
                </Box>
                {comment.author._id === loggedInUserId && (
                  <Box>
                    <IconButton
                      onClick={() => handleRemoveComment(comment._id)}
                    >
                      <Delete
                        sx={{
                          color: text,
                        }}
                      />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
          <Divider sx={{ margin: "0.75rem 0" }} />
          <Box
            display="flex"
            padding="0.5rem 0 0.5rem 0.75rem"
            borderRadius="0.5rem"
            backgroundColor={inputsBackground}
          >
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
                flex: "9",
                paddingRight: "0.3125rem",
              }}
            />
            <Box
              sx={{
                flex: "1",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box>
                <IconButton
                  onClick={handleComment}
                  style={{ backgroundColor: "transparent" }}
                >
                  <SendRounded />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default CommentsList;
