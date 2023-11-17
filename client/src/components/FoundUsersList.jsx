import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import Skeleton from "react-loading-skeleton";

import { findUsersLike } from "API";
import StyledLink from "./StyledLink";
import FlexBetween from "./FlexBetween";
import SkeletonLoad from "./SkeletonLoad";
import UserImage from "components/UserImage";
import DefaultUserIcon from "./DefaultUserIcon";

/* Сomponent for displaying list of users found by search query */
const FoundUsersList = ({ searchQuery, onLink }) => {
  const token = useSelector((state) => state.auth.token);
  const loggedInUserId = useSelector((state) => state.auth.user._id);

  // using query hook for fetching data & getting loading and error states
  const { isLoading, isError, data } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async ({ signal }) => {
      const foundUserResponse = await findUsersLike(
        searchQuery,
        loggedInUserId,
        token,
        signal //passing down abort signal for query cancelation
      );
      return Promise.all(foundUserResponse);
    },
    enabled: searchQuery.length > 0,
  });

  // early return in case of empty search query
  if (searchQuery.length === 0)
    return <Typography p="0 2rem">Search query is empty</Typography>;

  // displaying skeleton while search request is pending
  if (isLoading)
    return (
      <FlexBetween gap="1rem">
        <Skeleton circle width="30px" height="30px" />
        <SkeletonLoad
          loading={isLoading}
          width="100px"
          height="1rem"
          count={1}
        />
      </FlexBetween>
    );

  // early return in case of fetching error
  if (isError) {
    return (
      <Typography p="0 2rem">
        There are some errors in search querry. Try to correct it.
      </Typography>
    );
  }

  return (
    <>
      {data.map((user) => (
        <Box key={user._id} onClick={() => onLink()}>
          <StyledLink path={`/profile/${user._id}`}>
            {user.picturePath ? (
              <UserImage image={user.picturePath} size="30px" />
            ) : (
              <DefaultUserIcon
                firstNameInitial={user.firstName[0]}
                lastNameInitial={user.lastName[0]}
                size="30px"
              />
            )}
            <Typography p="0 2rem">{`${user.firstName} ${user.lastName}`}</Typography>
          </StyledLink>
        </Box>
      ))}
      {/* message for user when no user in db is resembling query */}
      {data.length === 0 && searchQuery.length !== 0 && (
        <Typography p="0 2rem">User not found...</Typography>
      )}
    </>
  );
};

export default FoundUsersList;
