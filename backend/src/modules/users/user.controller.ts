// src/modules/users/user.controller.ts
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../middleware/catchAsync";
import User from "./user.model";
import { AppError } from "../../utils/errorHandler";
import { AuthRequest } from "../../middleware/auth.middleware";
import { deleteCache, getCache, setCache } from "../../helper/redisCache";
import { calculateCursorPagination, createCursorPaginationMeta } from "../../helper/cursorPagination";
import sharp from "sharp";
import { deleteMultipleImagesFromCloudinary, uploadToCloudinary } from "../../utils/uploadToCloudinary";



/* ====================== EDIT PROFILE BY ID (COMPLEXITY: O(n)) ====================== */
export const editProfileById = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new AppError(401, "Unauthorized");

  const { name, email, phone, zipCode, profession, division } = req.body;

  const existingUser = await User.findById(userId);
  if (!existingUser) throw new AppError(404, "User not found");

  const updateData: any = {};

  // ================= BASIC FIELDS =================
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (phone) updateData.phone = phone;
  if (zipCode) updateData.zipCode = zipCode;
  if (profession) updateData.profession = profession;
  if (division) updateData.division = division;

  // ================= AVATAR (SINGLE IMAGE) =================
  const avatarFile = (req.files as any)?.avatar?.[0];

  if (avatarFile) {
    const avatarBuffer = await sharp(avatarFile.buffer)
      .resize(500, 500)
      .webp({ quality: 70 })
      .toBuffer();

    const avatarUpload = await uploadToCloudinary(
      avatarBuffer,
      "users/avatar"
    );

    updateData.avatar = {
      public_id: avatarUpload.public_id,
      url: avatarUpload.secure_url,
    };

    // delete old avatar
    if (
      existingUser.avatar?.public_id &&
      existingUser.avatar.public_id.startsWith("users/avatar")
    ) {
      await deleteMultipleImagesFromCloudinary([
        existingUser.avatar.public_id,
      ]).catch(() => {});
    }
  }

  // ================= NID PICTURES (MULTIPLE) =================
  const nidFiles = (req.files as any)?.nidPic as Express.Multer.File[];

  if (nidFiles && nidFiles.length > 0) {
    if (nidFiles.length > 3) {
      throw new AppError(400, "Maximum 3 NID images allowed");
    }

    const compressedBuffers = await Promise.all(
      nidFiles.map((file) =>
        sharp(file.buffer)
          .resize({ width: 1200 })
          .webp({ quality: 65 })
          .toBuffer()
      )
    );

    const uploads = await Promise.all(
      compressedBuffers.map((buffer) =>
        uploadToCloudinary(buffer, "users/nid")
      )
    );

    updateData.nidPic = uploads.map((img) => ({
      public_id: img.public_id,
      url: img.secure_url,
    }));

    // delete old nid images
    if (existingUser.nidPic?.length) {
      const oldIds = existingUser.nidPic
        .filter((i) => i.public_id.startsWith("users/nid"))
        .map((i) => i.public_id);

      if (oldIds.length) {
        await deleteMultipleImagesFromCloudinary(oldIds).catch(() => {});
      }
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError(400, "No valid fields to update");
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
    select: "-password -activationCode -resetPasswordOtp",
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});


/* ====================== GET USER PROFILE BY ID (COMPLEXITY: O(1)) ====================== */
export const getProfileById = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new AppError(401, "Unauthorized");

  // Try cache first
  const cacheKey = `user:${userId}`;
  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log(`⚡ Cache hit: ${cacheKey}`);
      return res.status(200).json({
        success: true,
        message: "Profile fetched (from cache)",
        data: cached,
      });
    }
  } catch (cacheError) {
    console.error("Cache retrieval error:", cacheError);
  }

  const user = await User.findById(userId)
    .select("-password -refreshToken -refreshTokenExpiry -activationCode -activationCodeExpiry -resetPasswordOtp -resetPasswordOtpExpiry")
    .lean();

  if (!user) throw new AppError(404, "User not found");

  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: user,
  });
});


/* ====================== GET ALL USERS (COMPLEXITY: O(n)) ====================== */
export const getAllUsers = catchAsync(async (req: AuthRequest, res: Response) => {
  const role = req.user?.role;

  if (role !== "category-admin" && role !== "super-admin") {
    throw new AppError(403, "You are not authorized to access user list!");
  }

  const { cursor, limit = 10, sortOrder = "desc" } = req.query;

  const cacheKey = `users:list:role=user:${cursor || 'first'}:${limit}:${sortOrder}`;

  // Try cache first
  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log(`⚡ Cache hit: ${cacheKey}`);
      return res.status(200).json({
        success: true,
        message: "User list fetched (from cache)",
        ...cached,
      });
    }
  } catch (cacheError) {
    console.error("Cache retrieval error:", cacheError);
  }

  // Calculate cursor pagination
  const paginationOptions = calculateCursorPagination({
    limit: parseInt(limit as string),
    cursor: cursor as string,
    sortBy: 'createdAt',
    sortOrder: sortOrder as "asc" | "desc",
  });

  // Build query
  const query = {
    role: "user",
    ...paginationOptions.filter,
  };

  // Fetch users
  const users = await User.find(query)
    .select("-password -refreshToken -refreshTokenExpiry -activationCode -activationCodeExpiry -resetPasswordOtp -resetPasswordOtpExpiry")
    .sort({ [paginationOptions.sortBy]: paginationOptions.sortOrder === 'asc' ? 1 : -1 })
    .limit(paginationOptions.limit + 1)
    .lean();

  // Create pagination metadata
  const { data, meta } = createCursorPaginationMeta(
    users,
    paginationOptions.limit,
    paginationOptions.sortBy,
    paginationOptions.sortOrder
  );

  // Get total count
  const total = await User.countDocuments({ role: "user" });

  const responseData = {
    data,
    meta: {
      ...meta,
      total,
    },
  };

  // Cache for 10 minutes
  await setCache(cacheKey, responseData, 600);

  res.status(200).json({
    success: true,
    message: "User list fetched successfully",
    ...responseData,
  });
});


/* ====================== GET ALL CATEGORY ADMINS (COMPLEXITY: O(n)) ====================== */
export const getAllCategoryAdmins = catchAsync(async (req: AuthRequest, res: Response) => {
  const role = req.user?.role;

  if (role !== "super-admin") {
    throw new AppError(403, "You are not authorized to access category admin list!");
  }

  const { cursor, limit = 10, sortOrder = "desc" } = req.query;

  const cacheKey = `users:list:role=category-admin:${cursor || 'first'}:${limit}:${sortOrder}`;

  // Try cache first
  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log(`⚡ Cache hit: ${cacheKey}`);
      return res.status(200).json({
        success: true,
        message: "Category admin list fetched (from cache)",
        ...cached,
      });
    }
  } catch (cacheError) {
    console.error("Cache retrieval error:", cacheError);
  }

  // Calculate cursor pagination
  const paginationOptions = calculateCursorPagination({
    limit: parseInt(limit as string),
    cursor: cursor as string,
    sortBy: 'createdAt',
    sortOrder: sortOrder as "asc" | "desc",
  });

  // Build query
  const query = {
    role: "category-admin",
    ...paginationOptions.filter,
  };

  // Fetch category admins
  const categoryAdmins = await User.find(query)
    .select("-password -refreshToken -refreshTokenExpiry -activationCode -activationCodeExpiry -resetPasswordOtp -resetPasswordOtpExpiry")
    .sort({ [paginationOptions.sortBy]: paginationOptions.sortOrder === 'asc' ? 1 : -1 })
    .limit(paginationOptions.limit + 1)
    .lean();

  // Create pagination metadata
  const { data, meta } = createCursorPaginationMeta(
    categoryAdmins,
    paginationOptions.limit,
    paginationOptions.sortBy,
    paginationOptions.sortOrder
  );

  // Get total count
  const total = await User.countDocuments({ role: "category-admin" });

  const responseData = {
    data,
    meta: {
      ...meta,
      total,
    },
  };

  // Cache for 10 minutes
  await setCache(cacheKey, responseData, 600);

  res.status(200).json({
    success: true,
    message: "Category admin list fetched successfully",
    ...responseData,
  });
});


/* ====================== UPDATE CATEGORY ADMIN (COMPLEXITY: O(1)) ====================== */
export const updateCategoryAdminRole = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { category, division } = req.body;

  if (req.user?.role !== "super-admin") {
    throw new AppError(403, "Only super-admin can update category admin!");
  }

  // Find the user to update
  const user = await User.findById(id);
  if (!user) throw new AppError(404, "User not found");

  // Ensure the target user is category-admin
  if (user.role !== "category-admin") {
    throw new AppError(400, "Only category-admin can be updated!");
  }

  // Update fields
  if (category) user.category = category;
  if (division) user.division = division;

  await user.save();

  // Invalidate cache
  await deleteCache(`user:${id}`);
  await deleteCache(`users:list:role=category-admin:*`);

  res.status(200).json({
    success: true,
    message: "Category admin updated successfully!",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      category: user.category,
      division: user.division,
    },
  });
});


/* ====================== DELETE CATEGORY ADMIN (COMPLEXITY: O(1)) ====================== */
export const deleteCategoryAdminRole = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (req.user?.role !== "super-admin") {
    throw new AppError(403, "Only super-admin can delete a category admin!");
  }

  const user = await User.findById(id);
  if (!user) throw new AppError(404, "User not found");

  if (user.role !== "category-admin") {
    throw new AppError(400, "Only category-admin accounts can be deleted!");
  }

  if (req.user._id!.toString() === id) {
    throw new AppError(400, "Super-admin cannot delete themselves!");
  }

  await User.findByIdAndDelete(id);

  // Invalidate cache
  await deleteCache(`user:${id}`);
  await deleteCache(`users:list:role=category-admin:*`);

  res.status(200).json({
    success: true,
    message: "Category admin deleted successfully!",
  });
});
