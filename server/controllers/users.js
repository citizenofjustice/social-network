import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUsersByQuery = async (req, res) => {
  try {
    const { query } = req.params;
    const result = [];
    // exact match
    const trimedQuery = query.trim();
    const users = await findUsersByNameOrEmail(trimedQuery);

    // if exact match not found
    // search by each word
    if (users.length === 0) {
      const words = trimedQuery.split(/\s+/);
      for (let i = 0; i < words.length; i++) {
        const users1 = await findUsersByNameOrEmail(words[i]);
        result.push(...users1);
      }
      res.status(200).json(result);
    } else {
      res.status(200).json(users);
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const findUsersByNameOrEmail = async (query) => {
  const regex = new RegExp(`${query}`);
  const users = await User.aggregate([
    {
      $project: {
        name: { $concat: ["$firstName", " ", "$lastName"] },
        email: "$email",
        picturePath: "$picturePath",
      },
    }, //stage1
    {
      $match: {
        $or: [
          { name: { $regex: regex, $options: "i" } },
          { email: { $regex: regex, $options: "i" } },
        ],
      },
    }, //stage2
    { $sort: { name: 1 } },
  ]);
  return users;
};
