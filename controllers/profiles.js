const Profile = require("../models/profile");
const Post = require("../models/post");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

module.exports = {
  signup,
  login,
  newProfile,
  userPosts,
  userPublicPosts,
  getAllProfiles,
};

async function signup(req, res) {
  const profile = new Profile(req.body);
  try {
    await profile.save();
    const token = createJWT(profile);
    res.json({ token });
  } catch (err) {
    // Probably a duplicate email
    res.status(400).json(err);
  }
}

async function login(req, res) {
  try {
    const profile = await Profile.findOne({ email: req.body.email });
    if (!profile) return res.status(401).json({ err: "bad credentials" });
    profile.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch) {
        const token = createJWT(profile);
        res.json({ token });
      } else {
        return res.status(401).json({ err: "bad credentials" });
      }
    });
  } catch (err) {
    return res.status(400).json(err);
  }
}

async function newProfile(req, res) {
  const newProfile = req.body;
  const currentProfile = req.body.email;
  try {
    let profile = await Profile.findOneAndUpdate(
      { email: req.body.email },
      { $set: newProfile },
      {
        new: true,
      }
    );
    const token = createJWT(profile);
    res.json({ token });
  } catch (err) {
    return res.status(400).json(err);
  }
}

async function userPosts(req, res) {
  const id = req.params.id;
  await Post.find({ profile: id }, function (err, posts) {
    if (err) return err;
    return res.json(posts);
  });
}

async function userPublicPosts(req, res) {
  const id = req.params.id;
  const profilePosts = await Post.find({ profile: id }).populate("profile");
  console.log(profilePosts);
  res.json(profilePosts);
}

async function getAllProfiles(req, res) {
  const allProfiles = await Profile.find().populate("post");
  res.json(allProfiles);
}

// Helper Functions
function createJWT(profile) {
  return jwt.sign({ profile }, SECRET, { expiresIn: "24h" });
}
