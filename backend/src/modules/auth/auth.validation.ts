// src/modules/auth/auth.validation.ts
import {z} from "zod";

/* ====================== REGISTER USER VALIDATION ====================== */
export const registerUserSchema = z.object({
    body: z.object({
        name: z.string().min(3, "Name must be at least 3 characters long"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
        phone: z.string().min(11, "Phone number must be at least 11 characters long"),
        nid: z.string().min(10, "NID number must be at least 10 characters long"),
        role: z.enum(["user", "category-admin", "super-admin"]).optional(),
        category: z.enum(["broken_road", "water", "gas", "electricity", "other"]).optional(),
        division: z.enum(["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh"]).optional(),
    })
    // confirmPassword & password match validation
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
    }),
});


/* ====================== ACTIVATE USER VALIDATION ====================== */
export const activateUserSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        activationCode: z.string().min(3, "Activation code must be at least 3 characters long"),
    }),
});


/* ====================== LOGIN USER VALIDATION ====================== */
export const loginUserSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
    }),
});
