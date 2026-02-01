// src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import { catchAsync } from "../../middleware/catchAsync";
import { AuthRequest } from "../../middleware/auth.middleware";
import { sanitizeBody } from "../../helper/senitize";
import { AppError } from "../../utils/errorHandler";
import User, { emailRegex } from "../users/user.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendActivationEmail } from "../../utils/email";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token";
import { clearAuthCookies, setAuthCookies } from "../../utils/cookie";



/* ====================== REGISTER USER CONTROLLER (COMPLEXITY: O(1)) ====================== */
export const register = catchAsync(async (req: AuthRequest, res: Response) => {
  const body = sanitizeBody(req.body);
  const { name, email, password, confirmPassword, phone, nid, category } = body;

  if (!name || !email || !password || !confirmPassword) {
    throw new AppError(400, "Required fields missing!");
  }

  if (password !== confirmPassword) {
    throw new AppError(400, "Passwords do not match!");
  }

  // ================= CHECK IF USER ALREADY EXISTS =================
  const exists = await User.findOne({
    $or: [{ email }, { phone }, { nid }],
  });

  if (exists) {
    if (exists.email === email) throw new AppError(400, "Email already exists!");
    if (exists.phone === phone) throw new AppError(400, "Phone already exists!");
    if (exists.nid === nid) throw new AppError(400, "NID already exists!");
  }

  const userCount = await User.estimatedDocumentCount();

  let role: "super-admin" | "category-admin" | "user";
  let isVerified = false;
  let activationCode: string | undefined;
  let activationCodeExpiry: Date | undefined;

  // ================= ROLE DECISION ================= 

  // 1 First user → Super Admin
  if (userCount === 0) {
    role = "super-admin";
  }
  // 2 Super-admin creating category-admin
  else if (req.user && req.user.role === "super-admin") {
    if (!category) {
      throw new AppError(400, "Category is required for category-admin!");
    }
    role = "category-admin";
    isVerified = true;
  }
  // 3 Normal public user
  else {
    role = "user";
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // Activation only for super-admin & user
  if (role !== "category-admin") {
    activationCode = crypto.randomBytes(3).toString("hex").toUpperCase();
    activationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
  }

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    nid,
    role,
    category: role === "category-admin" ? category : undefined,
    isVerified,
    activationCode,
    activationCodeExpiry,
  });

  // Send email only when needed
  if (role !== "category-admin") {
    await sendActivationEmail(email, activationCode!);
  }

  res.status(201).json({
    success: true,
    message:
    role === "category-admin" ? "Category admin created successfully!" : "Registration successful! Check your email to activate account.",
    data: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});


/* ====================== ACTIVATE USER ACCOUNT (COMPLEXITY: O(1)) ====================== */
export const activateUser = catchAsync(async (req: Request, res: Response) => {
  const body = sanitizeBody(req.body);
  const { email, activationCode } = body;

  if (!email || !activationCode) {
    throw new AppError(400, "Email and activation code are required!");
  }

  const user = await User.findOne({ email }).select("+activationCode +activationCodeExpiry");

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  if (user.isVerified) {
    throw new AppError(400, "Account already activated!");
  }

  if (user.activationCode !== activationCode.toUpperCase()) {
    throw new AppError(400, "Invalid activation code!");
  }

  if (!user.activationCodeExpiry || user.activationCodeExpiry < new Date()) {
    throw new AppError(400, "Activation code expired!");
  }

  // Activate user
  user.isVerified = true;
  user.activationCode = undefined!;
  user.activationCodeExpiry = undefined!;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Account activated successfully!",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});


/* ====================== LOGIN USER (COMPLEXITY: O(1)) ====================== */
export const login = catchAsync(async (req: Request, res: Response) => {
  const body = sanitizeBody(req.body);
  const { email, password } = body as any;

  // ================ VALIDATION =================
  if (!email || !emailRegex.test(email)) {
    throw new AppError(400, "Please provide a valid email!");
  }
  if (!password || password.length < 6) {
    throw new AppError(400, "Password must be at least 6 characters!");
  }

  const user = await User.findOne({ email }).select("+password").lean();
  if (!user) throw new AppError(404, "User not found!");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(401, "Invalid password!");

  // ================ CHECK USER VERIFICATION =================
  if (!user.isVerified) {
    throw new AppError(403, "Please verify your email before logging in!");
  }

  // ================ TOKEN GENERATION =================
  const accessToken = generateAccessToken({ id: user._id!.toString(), role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id!.toString(), role: user.role });

  // ================= SET COOKIES =================
  setAuthCookies(res, accessToken, refreshToken);

  // ================= SAFE USER OBJECT =================
  const safeUser = {
    _id: user._id!.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    category: user.category,
    isVerified: user.isVerified,
    phone: user.phone,
    zipCode: user.zipCode,
    profession: user.profession,
    division: user.division,
    nidPic: user.nidPic,
    avatar: user.avatar,
  };

  res.status(200).json({
  success: true,
  message: "Login successful!",
  data: {
    user: safeUser,
    accessToken,
  }});
});


/* ====================== REFRESH TOKEN (COMPLEXITY: O(1)) ====================== */
export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshTokenFromCookie = req.cookies?.refreshToken;

  if (!refreshTokenFromCookie) {
    throw new AppError(401, "Refresh token missing");
  }

  let decoded: any;

  try {
    decoded = verifyRefreshToken(refreshTokenFromCookie);
  } catch (err: any) {
    // Token expired or tampered → force logout
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw new AppError(401, "Refresh token expired or invalid");
  }

  const user = await User.findById(decoded.id).select("role isVerified");

  if (!user) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw new AppError(401, "User no longer exists");
  }

  if (!user.isVerified) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw new AppError(403, "Account not verified");
  }

  // SECURITY CHECK: role mismatch
  if (decoded.role !== user.role) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw new AppError(401, "Token role mismatch");
  }

  // Generate new access token expires in 10 minutes
  const newAccessToken = generateAccessToken({id: user._id!.toString(),role: user.role});

  // (Optional but recommended) Refresh token rotation expires in 7 days
  const newRefreshToken = generateRefreshToken({id: user._id!.toString(),role: user.role});

  // Set new cookies
  setAuthCookies(res, newAccessToken, newRefreshToken);

  res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
    data: {
      accessToken: newAccessToken,
    },
  });
});


/* ====================== LOGOUT USER (COMPLEXITY: O(1)) ====================== */
export const logout = catchAsync(async (req: Request, res: Response) => {

  // ================ CLEAR COOKIES =================
  await clearAuthCookies(res);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});


/* ====================== FORGET PASSWORD (COMPLEXITY: O(1)) ====================== */
export const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = sanitizeBody(req.body) as any;

  if (!email) throw new AppError(400, "Email is required!");

  const user = await User.findOne({ email });
  if (!user) throw new AppError(404, "User not found!");

  // ================ OTP GENERATION =================
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // ================ OTP HASHING =================
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  user.resetPasswordOtp = hashedOtp;
  user.resetPasswordOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await user.save({ validateBeforeSave: false });

  try {
    await sendActivationEmail(email, `Your password reset OTP is: ${otp}`);
  } catch (err) {
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpiry = null;
    await user.save({ validateBeforeSave: false });
    throw new AppError(500, "Failed to send reset OTP. Please try again later.");
  }

  res.status(200).json({
    success: true,
    message: "Password reset OTP sent successfully to your email.",
    data: {
      email,
      expiresIn: "10 minutes",
    },
  });
});


/* ====================== RESET PASSWORD (COMPLEXITY: O(1)) ====================== */
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { otp, newPassword } = sanitizeBody(req.body) as any;

  if (!otp || !newPassword) throw new AppError(400, "OTP and new password are required!");
  if (newPassword.length < 6) throw new AppError(400, "Password must be at least 6 characters!");

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await User.findOne({
    resetPasswordOtp: hashedOtp,
    resetPasswordOtpExpiry: { $gt: new Date() },
  });

  if (!user) throw new AppError(400, "Invalid or expired OTP!");

  // ================ PASSWORD HASHING =================
  user.password = await bcrypt.hash(newPassword, 12);
  user.resetPasswordOtp = null;
  user.resetPasswordOtpExpiry = null;

  // =============== CLEAR COOKIES =================
  await clearAuthCookies(res);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully! Please login again.",
  });
});
