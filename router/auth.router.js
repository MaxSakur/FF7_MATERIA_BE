const Router = require('express');
const { check, validationResult } = require('express-validator');
const User = require('./../models/User');
const config = require('config');
const bcrypt = require('bcrypt');
const router = new Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('./../middleware/auth.middleware');

const passwordSize = {
  min: 3,
  max: 12,
};

router.post(
  '/registration',
  [
    check('email', 'incorrect email').isEmail(),
    check(
      'password',
      `Password must be longer than ${passwordSize.min} and shorter than ${passwordSize.max}`,
    ).isLength({ min: passwordSize.min, max: passwordSize.max }),
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response
          .status(400)
          .json({ message: 'Incorrect request', errors });
      }

      const { email, password } = request.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return response
          .status(400)
          .json({ message: `User with ${email} is already exist` });
      }
      const hashPassword = await bcrypt.hash(password, passwordSize.max);
      const user = new User({ email, password: hashPassword });
      await user.save();
      response.json({ message: `User was created` });
    } catch (error) {
      response.send({ message: `${request.body} and error is ${error}` });
    }
  },
);

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPassValid = bcrypt.compareSync(password, user.password);
    if (!isPassValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ id: user.id }, config.get('secretKey'), {
      expiresIn: '24h',
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        registered: user.registered,
        status: user.status,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({ message: 'Server error' });
  }
});

router.get('/auth', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    const token = jwt.sign({ id: user.id }, config.get('secretKey'), {
      expiresIn: '1h',
    });
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        registered: user.registered,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({ message: 'Server error' });
  }
});

module.exports = router;
