import { Express, Request, Response } from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { pool } from "./db";

const scryptAsync = promisify(scrypt);

/**
 * Hash a plain text password using scrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePasswords(
  supplied: string,
  stored: string
): Promise<boolean> {
  try {
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) return false;
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch {
    return false;
  }
}

/**
 * Setup authentication middleware and routes
 */
export function setupAuth(app: Express) {
  // Configure session store
  const store = new (pgSession(session))({
    pool,
    createTableIfMissing: true,
  });

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      secure: app.get("env") === "production",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
  }

  // Apply session middleware
  app.use(session(sessionSettings));

  /**
   * User Login Endpoint
   * Regular students/users login here
   */
  app.post("/api/auth/user-login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Username and password required" });
      }

      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }

      // Verify password
      const isValid = await comparePasswords(password, user.password);
      if (!isValid) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }

      // Create session
      req.session.userId = user.id;
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve(null);
        });
      });

      return res.status(200).json({
        success: true,
        message: "User login successful",
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
        },
      });
    } catch (error: any) {
      console.error("User login error:", error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Login failed",
          error: error.message,
        });
    }
  });

  /**
   * Admin Login Endpoint
   * Only users with role === 'admin' can login here
   */
  app.post("/api/auth/admin-login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Username and password required" });
      }

      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      // Check if user is admin
      if (user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin access required. This account does not have admin privileges.",
        });
      }

      // Verify password
      const isValid = await comparePasswords(password, user.password);
      if (!isValid) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      // Create session
      req.session.userId = user.id;
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve(null);
        });
      });

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
        },
      });
    } catch (error: any) {
      console.error("Admin login error:", error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Admin login failed",
          error: error.message,
        });
    }
  });

  /**
   * Student Registration Endpoint
   * Only for creating new student accounts
   */
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { username, password, fullName } = req.body;

      // Validate input
      if (!username || !password || !fullName) {
        return res.status(400).json({
          success: false,
          message: "Username, password, and full name are required",
        });
      }

      if (username.length < 3) {
        return res.status(400).json({
          success: false,
          message: "Username must be at least 3 characters",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      // Check if username exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Username already exists",
        });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        fullName,
        role: "user", // Always create as student
      });

      // Auto-login after registration
      req.session.userId = user.id;
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve(null);
        });
      });

      return res.status(201).json({
        success: true,
        message: "Account created successfully",
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
        },
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Registration failed",
          error: error.message,
        });
    }
  });

  /**
   * Auth Status Endpoint
   * Get currently logged in user
   */
  app.get("/api/auth/me", (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Fetch user data
    storage
      .getUser(req.session.userId)
      .then((user) => {
        if (!user) {
          req.session.destroy(() => {});
          return res.status(401).json({
            success: false,
            message: "User not found",
          });
        }

        return res.status(200).json({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
          },
        });
      })
      .catch((error) => {
        console.error("Auth me error:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch user",
        });
      });
  });

  /**
   * Logout Endpoint
   */
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Logout failed",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });
}
