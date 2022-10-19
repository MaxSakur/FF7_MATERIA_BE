const Router = require('express');
const User = require('./../models/User');
const router = new Router();
const authMiddleware = require('./../middleware/auth.middleware');

router.post('/register', authMiddleware, async (req, res) => {
  try {
    const { isBanned } = req.body;
    const user = await User.findOne({ _id: req.user.id });

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
    res.send({ message: 'Server error' });
  }
});

router.post('/registerCharacter', authMiddleware, async (req, res) => {
  try {
    const { gender, race, role } = req.body;
    const update = {
      character: {
        lvl: 1,
        gender,
        race,
        role,
        equipment: [],
        inventory: [],
      },
    };
    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        user: {
          ...update,
        },
      },
    );

    return res.json({
      success: true,
      user: {
        ...update,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({ message: 'Server error' });
  }
});

module.exports = router;
