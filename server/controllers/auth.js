import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { uploadPictureAndGetUrl } from "../index.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    let picturePath;
    if (!req.file) {
      picturePath = null;
    } else {
      picturePath = await uploadPictureAndGetUrl(req.file);
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath: picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(200).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user: user._doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAuthData = async (req, res) => {
  try {
    const { email, oldPassword, password } = req.body;
    const { id } = req.params;

    const result = {
      errors: [],
    };
    const user = await User.findOne({ _id: id });
    if (email) {
      const isEmailTaken = await User.findOne({ email: email });
      if (isEmailTaken) {
        result.errors.push("The selected email address is already taken.");
      } else {
        user.email = email;
        result.email = true;
      }
    }

    if (oldPassword && password) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        result.errors.push(
          "Current password is not correct. Check old password input for typos."
        );
      } else {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        user.password = passwordHash;
        result.password = true;
      }
    }
    if (result.errors.length > 0) res.status(422).json(result);
    await user.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};
