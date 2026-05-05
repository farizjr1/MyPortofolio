import { Router, Request, Response } from "express";
import crypto from "crypto";
import { User } from "../models/User";
import { generateToken, verifyToken } from "../middlewares/auth";
import {
  RegisterBody,
  LoginBody,
  VerifyEmailBody,
  ForgotPasswordBody,
  ResetPasswordBody,
} from "@workspace/api-zod";
import {
  getTransporter,
  smtpFrom,
  frontendUrl,
  verifyEmailHtml,
  resetPasswordHtml,
} from "../lib/mailer";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const parsed = RegisterBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Validation error", error: parsed.error.message });
      return;
    }
    const { name, email, password } = parsed.data;

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    // First registered user becomes admin (portfolio owner bootstrap);
    // all subsequent registrations default to viewer.
    const adminExists = await User.exists({ role: "admin" });
    const role = adminExists ? "viewer" : "admin";

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = await User.create({
      name,
      email,
      password,
      role,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Send verification email if SMTP is configured
    const transporter = getTransporter();
    if (transporter) {
      const verifyUrl = `${frontendUrl()}/verify-email?token=${verificationToken}`;
      try {
        await transporter.sendMail({
          from:    smtpFrom(),
          to:      email,
          subject: "Verifikasi Email — Portfolio",
          html:    verifyEmailHtml(name, verifyUrl),
        });
        req.log.info({ to: email }, "Verification email sent");
      } catch (mailErr) {
        req.log.error({ mailErr }, "Failed to send verification email (non-fatal)");
      }
    } else {
      req.log.warn("SMTP not configured — skipping verification email");
    }

    const token = generateToken({ id: user._id.toString(), email: user.email, role: user.role });
    res.status(201).json({ token, user: user.toJSON() });
  } catch (err) {
    req.log.error({ err }, "Register error");
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const parsed = LoginBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Validation error", error: parsed.error.message });
      return;
    }
    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const match = await user.comparePassword(password);
    if (!match) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = generateToken({ id: user._id.toString(), email: user.email, role: user.role });
    res.json({ token, user: user.toJSON() });
  } catch (err) {
    req.log.error({ err }, "Login error");
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify-email", async (req: Request, res: Response) => {
  try {
    const parsed = VerifyEmailBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }
    const { token } = parsed.data;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired verification token" });
      return;
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    req.log.error({ err }, "Verify email error");
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const parsed = ForgotPasswordBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Valid email required" });
      return;
    }
    const { email } = parsed.data;

    // Always return the same message to prevent email enumeration
    const genericMsg = { message: "If that email exists, a reset link has been sent." };

    const user = await User.findOne({ email });
    if (!user) {
      res.json(genericMsg);
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    // Send reset email if SMTP is configured
    const transporter = getTransporter();
    if (transporter) {
      const resetUrl = `${frontendUrl()}/reset-password?token=${resetToken}`;
      try {
        await transporter.sendMail({
          from:    smtpFrom(),
          to:      email,
          subject: "Reset Password — Portfolio",
          html:    resetPasswordHtml(user.name, resetUrl),
        });
        req.log.info({ to: email }, "Password reset email sent");
      } catch (mailErr) {
        req.log.error({ mailErr }, "Failed to send reset email (non-fatal)");
      }
    } else {
      req.log.warn("SMTP not configured — password reset token saved but email not sent");
    }

    res.json(genericMsg);
  } catch (err) {
    req.log.error({ err }, "Forgot password error");
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const parsed = ResetPasswordBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Validation error" });
      return;
    }
    const { token, password } = parsed.data;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired reset token" });
      return;
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    req.log.error({ err }, "Reset password error");
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user.toJSON());
  } catch (err) {
    req.log.error({ err }, "Get me error");
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", verifyToken, (_req: Request, res: Response) => {
  res.json({ message: "Logged out successfully" });
});

export default router;
