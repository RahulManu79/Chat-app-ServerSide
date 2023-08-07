const User = require("../model/UserModel");
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const isUsernameExsiste = await User.findOne({ username });
    if (isUsernameExsiste) {
      return res
        .status(200)
        .json({ status: false, message: "This username already exist" });
    }
    const ifEmailExsiste = await User.findOne({ email });
    if (ifEmailExsiste) {
      return res.status(200).json({
        status: false,
        message: `The Email ${email} is already exsiste`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    delete user.password;

    return res.status(200).json({
      status: true,
      message: `User created successfully`,
      user,
    });
  } catch (error) {
    return error;
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(200)
      .json({ status: false, message: "No user registered in this email" });
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return res
      .status(200)
      .json({ status: false, message: "Incorrect Password" });
  }

  return res.status(200).json({
    status: true,
    user,
  });
};

const setAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    const avatarImage = req.body.image;
    const user = await User.findByIdAndUpdate(id, {
      isAvatarImgSet: true,
      avatarImage,
    });
    return res.json({isSet:user.isAvatarImgSet,image:user.avatarImage})
  } catch (error) {}
};

const findUsers = async (req, res) => {
  try {
    const user = await User.find({_id:{$ne:req.params.id}})
    return res.json({ user:user });
  } catch (error) {}
};

const logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

module.exports = {
  register,
  login,
  setAvatar,
  findUsers,
  logOut,
};
