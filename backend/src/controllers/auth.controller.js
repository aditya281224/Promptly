import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function RegisterController(req, res) {
  const { email, password, username } = req.body;

  const userExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (userExists) {
    return res.status(400).json({
      message:
        email === userExists.email
          ? "Email already exists"
          : "UserName already taken",
      success: false,
      err: "User already exists",
    });
  }

  const user = await userModel.create({ username, email, password });

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  await sendEmail({
    to: email,
    subject: "Welcome to promptly",
    html: `<p>Hi ${username},</p>
            <p> Thank you for registering promptly</p>
            <p>Verify your email by clicking on the link below</p>
            <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify email</a>
            `,
  });

  res.status(201).json({
    message: "User registered",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function verifyEmail(req, res) {
  const { token } = req.query;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findOne({ email: decoded.email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid token",
      success: false,
      err: "User not found",
    });
  }

  user.verified = true;
  await user.save();
  res.send(`
  <h1>Email verified successfully</h1>
  <p>Your email has been verified. You can now log in to your account</p>
`);
}


export async function login(req,res){
  const {email,password}=req.body;

  const user = await userModel.findOne({email})
  if(!user){
    return res.status(400).json({
      message: "Invalid User",
      success: false,
      err: "User not found",
    });
  }

  const isPasswordMatch = await user.comparePassword(password);

  if(!isPasswordMatch){
    return res.status(400).json({
      message:"Invalid email or password",
      succcess:false,
      err:"incorrect password"
    })
  }

  if(!user.verified){
    return res.status(400).json({
      message:"Please verify your email before logging in",
      success:false,
      err:"Email not verified"
    })
  }
  const token = jwt.sign({
    id:user._id,
    username:user.username,

  },process.env.JWT_SECRET,{expiresIn:'7d'})

  res.cookie("token",token);

  res.status(200).json({
    message:"Login successful",
    success:true,
    user:{
      id:user._id,
      username:user.username,
      email:user.email
    }
  })

}


export async function getMe(req,res){
  const userId = req.user.id;
  const user = await userModel.findById(userId).select("-password");

  res.status(200).json({
    message:"User details fetched successfully",
    success:true,
    user
  })
}
