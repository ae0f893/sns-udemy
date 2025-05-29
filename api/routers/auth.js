const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    });

    return res.json({ user });
});

router.post("/login", async (req, res) => {
    const { email, password} = req.body;

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if(!user){
        return res.status(401).json({error: "メールアドレスかパスワードが間違っています"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(401).json({error: "パスワードが間違っています"});
    }

    const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {
        expiresIn: "1h",
    });
    
    return res.json({ token });
});

module.exports = router;