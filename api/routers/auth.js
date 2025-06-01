const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateIdenticon = require("../utils/generateIdenticon");

router.post("/register", async (req, res) => {
  const { name, email, password, bio } = req.body;

  const defaultIconImage = generateIdenticon(name);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profile: {
        create: {
          bio: bio,
          profileImageUrl: defaultIconImage,
        },
      },
    },
    include: { profile: true },
  });

  return res.status(200).json({ user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res
      .status(401)
      .json({ error: "メールアドレスかパスワードが間違っています" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "パスワードが間違っています" });
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  return res.status(200).json({ token });
});

module.exports = router;
