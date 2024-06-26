import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await User.findById(id);

    res.status(200).json(user._doc);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const unsortedFriends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const sortedFriends = sortByName(unsortedFriends);
    const formattedFriends = sortedFriends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
        };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
    } else {
      user.friends.push(friendId);
    }
    await user.save();

    res.status(200).json(user.friends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUsersByQuery = async (req, res) => {
  try {
    const { query, id } = req.params;
    const result = [];
    // exact match
    const trimedQuery = query.trim();
    const exactUser = await findUsersByNameOrEmail(trimedQuery, id);

    // if exact match not found
    // search by each word
    if (exactUser.length === 0) {
      const words = trimedQuery.split(/\s+/);
      for (let i = 0; i < words.length; i++) {
        const users = await findUsersByNameOrEmail(words[i], id);
        result.push(...users);
      }
      res.status(200).json(result);
    } else {
      res.status(200).json(exactUser);
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const findUsersByNameOrEmail = async (query, id) => {
  const regex = new RegExp(`${query}`);
  const users = await User.aggregate([
    {
      $project: {
        _id: { $toString: "$_id" },
        firstName: "$firstName",
        lastName: "$lastName",
        email: "$email",
        picturePath: "$picturePath",
      },
    }, //stage1
    {
      $match: {
        $or: [
          {
            _id: { $ne: id },
            name: { $regex: regex, $options: "i" },
          },
          {
            _id: { $ne: id },
            email: { $regex: regex, $options: "i" },
          },
        ],
      },
    }, //stage2
    { $sort: { firstName: 1 } },
  ]);
  return users;
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userData } = req.body;
    const updatedUserData = JSON.parse(userData);

    const options = {
      upsert: false,
      returnDocument: "after",
      returnNewDocument: true,
    };
    const result = await User.findOneAndUpdate(
      { _id: updatedUserData._id },
      updatedUserData,
      options
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

const sortByName = (arrayOfUsers) => {
  arrayOfUsers.sort((a, b) => {
    let fa = a.firstName.toLowerCase(),
      fb = b.firstName.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
  return arrayOfUsers;
};
