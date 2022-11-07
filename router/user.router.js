const Router = require("express");
const User = require("./../models/User");
constrerouter = new Router();
const authMiddleware = require("./../middleware/auth.middleware");
const router = new Router();

router.post("/register", authMiddleware, async (req, res) => {
  try {
    const { isBanned } = req.body;
    const user = await User.findOne({ _id: req.user.id });
    console.log(req);
    return res.json({
      success: true,
      user: {
        id: user.id,
        isBanned: isBanned || user.isBanned,
        character: {
          lvl: 1,
          gender: {},
          race: {},
          role: {},
          equipment: [],
          inventory: [],
        },
      },
    });
  } catch (e) {
    console.log(e);
    res.send({ message: "Server error" });
  }
});

router.post("/registerCharacter", authMiddleware, async (req, res) => {
  try {
    const { gender, role } = req.body;
    const update = {
      character: {
        lvl: 1,
        gender,
        role,
        equipment: [],
        inventory: [],
      },
    };
    const currentUser = await User.findOne({ _id: req.user.id });

    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        user: {
          ...currentUser,
          update,
        },
      }
    );

    return res.json({
      user: {
        currentUser,
        ...update,
        yo: "hi",
      },
    });
  } catch (e) {
    console.log("error", e);
    res.send({ message: "Server error", status: 401 });
  }
});

module.exports = router;
