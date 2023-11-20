const URL = process.env.REACT_APP_API_URL;

export const registerUser = async (formData) => {
  const response = await fetch(`${URL}auth/register`, {
    method: "POST",
    body: formData,
  });
  return response;
};

export const loginUser = async (values) => {
  const response = await fetch(`${URL}auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  return response;
};

export const fetchUser = async (userId, token, signal) => {
  const response = await fetch(URL + `users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: signal,
  });
  const data = await response.json();
  return data;
};

export const fetchFriends = async (userId, token, signal) => {
  const response = await fetch(URL + `users/${userId}/friends`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: signal,
  });
  return response;
};

export const fetchAllPosts = async (
  loggedInUserId,
  token,
  limit,
  pageNum,
  signal
) => {
  const response = await fetch(
    URL + `posts/${loggedInUserId}/feed/${limit}/${pageNum}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      signal: signal,
    }
  );
  const data = await response.json();
  return data;
};

export const fetchUserPosts = async (userId, token, limit, pageNum, signal) => {
  const response = await fetch(
    URL + `posts/user/${userId}/limit/${limit}/page/${pageNum}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      signal: signal,
    }
  );
  const data = await response.json();
  return data;
};

export const sendPost = async (formData, userId, token) => {
  const response = await fetch(URL + `posts/${userId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const posts = await response.json();
  return posts;
};

export const patchFriend = async (loggedInUserId, friendId, token) => {
  const response = await fetch(URL + `users/${loggedInUserId}/${friendId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const friendsData = await response.json();
  return friendsData;
};

export const patchPostLikes = async (postId, token, loggedInUserId) => {
  const response = await fetch(URL + `posts/${postId}/like`, {
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

export const addCommentToPost = async (postId, formData, token) => {
  const response = await fetch(URL + `posts/${postId}/comment/add`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const updatedPost = await response.json();
  return updatedPost;
};

export const removeCommentFromPost = async (
  postId,
  commentId,
  loggedInUserId,
  token
) => {
  const response = await fetch(
    URL + `posts/${postId}/comment/${commentId}/remove/by/${loggedInUserId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const updatedPost = await response.json();
  return updatedPost;
};

export const getEditablePostData = async (postId, token, loggedInUserId) => {
  const response = await fetch(
    URL + `posts/${postId}/get/edit/by/${loggedInUserId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const editPostData = await response.json();
  return editPostData;
};

export const editSelectedPost = async (
  postId,
  formData,
  token,
  loggedInUserId
) => {
  const response = await fetch(
    URL + `posts/${postId}/edit/by/${loggedInUserId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "multipart/form-data",
      },
      body: formData,
    }
  );
  // const updatedPost = await response.json();
  const updatedPost = await response.json();
  return updatedPost;
};

export const removeSelectedPost = async (postId, token, loggedInUserId) => {
  const response = await fetch(
    URL + `posts/${postId}/remove/by/${loggedInUserId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  return response;
};

export const findUsersLike = async (query, loggedInUserId, token, signal) => {
  const response = await fetch(
    URL + `users/like/${query}/not/${loggedInUserId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      signal: signal,
    }
  );
  const foundUsers = await response.json();
  return foundUsers;
};

export const updateProfileInfo = async (formData, userId, token) => {
  const response = await fetch(URL + `users/${userId}/profile/change`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const updatedPost = await response.json();
  return updatedPost;
};

export const changeAuthData = async (formData, userId, token) => {
  const response = await fetch(URL + `auth/${userId}/profile/changeAuthData`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const updatedData = await response.json();
  return updatedData;
};

export const fetchСertainPost = async (postId, token, signal) => {
  const response = await fetch(URL + `posts/view/${postId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    signal: signal,
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return response.status;
  }
};
