const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");
const isAuthenticated = require("../middlewares/isAuthenticated");
const prisma = new PrismaClient();

router.post("/post", isAuthenticated, async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "投稿内容がありません." });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        // TODO: authorIdを変数から読み取る
        authorId: req.userId,
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });
    return res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "サーバーエラーです。",
    });
  }
});

router.get("/get_latest_posts", async (req, res) => {
  try {
    const latestPosts = await prisma.post.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });

    return res.status(200).json(latestPosts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "サーバーエラーです。" });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const userPosts = await prisma.post.findMany({
      where: {
        authorId: parseInt(userId),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      },
    });
    return res.status(200).json(userPosts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "サーバーエラーです。" });
  }
});
module.exports = router;
