export const registerUser = async (formData) => {
  const response = await fetch("http://localhost:3001/auth/register", {
    method: "POST",
    body: formData,
  });
  const registeredUser = await response.json();
  return registeredUser;
};

export const loginUser = async (values) => {
  const response = await fetch("http://localhost:3001/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const loggedInUserData = await response.json();
  return loggedInUserData;
};

export const fetchUser = async (userId, token) => {
  const response = await fetch(`http://localhost:3001/users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export const fetchFriends = async (loggedInUserId, token) => {
  const response = await fetch(
    `http://localhost:3001/users/${loggedInUserId}/friends`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const friendsData = await response.json();
  return friendsData;
};

export const fetchAllPosts = async (loggedInUserId, token, limit, pageNum) => {
  const response = await fetch(
    `http://localhost:3001/posts/${loggedInUserId}/feed/${limit}/${pageNum}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await response.json();
  return data;
};

export const fetchUserPosts = async (userId, token, limit, pageNum) => {
  const response = await fetch(
    `http://localhost:3001/posts/user/${userId}/limit/${limit}/page/${pageNum}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await response.json();
  return data;
};

export const sendPost = async (formData, token) => {
  const response = await fetch("http://localhost:3001/posts", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const posts = await response.json();
  return posts;
};

export const patchFriend = async (loggedInUserId, friendId, token) => {
  const response = await fetch(
    `http://localhost:3001/users/${loggedInUserId}/${friendId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const friendsData = await response.json();
  return friendsData;
};

export const patchPostLikes = async (postId, token, loggedInUserId) => {
  const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: loggedInUserId }),
  });
  const updatedPost = await response.json();
  return updatedPost;
};

export const findUsersLike = async (query, loggedInUserId, token) => {
  const response = await fetch(
    `http://localhost:3001/users/like/${query}/not/${loggedInUserId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const foundUsers = await response.json();
  return foundUsers;
};
