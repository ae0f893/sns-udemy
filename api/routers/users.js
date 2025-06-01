const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");
const isAuthenticated = require("../middlewares/isAuthenticated");
const prisma = new PrismaClient();

router.get("/find", isAuthenticated, async (req, res) => {
  try {
    console.log(req.id);
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: "ユーザーが見つかりませんでした。" });
    }
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: parseInt(userId),
      },
      include: {
        user: true,
      },
    });

    console.log(profile);

    if (!profile) {
      return res
        .status(404)
        .json({ message: "プロフィールが見つかりませんでした" });
    }
    res.status(200).json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
