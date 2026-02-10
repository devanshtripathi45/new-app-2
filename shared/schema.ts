import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // 'admin' | 'user'
  fullName: text("full_name").notNull(),
  bio: text("bio"),
  profilePhoto: text("profile_photo"),
});

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(), // HTML content from rich text editor
  coverImage: text("cover_image"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull().default(0), // in cents
  coverImage: text("cover_image"),
  modules: jsonb("modules").$type<{ title: string; lessons: { title: string; content: string }[] }[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
});

export const aboutMe = pgTable("about_me", {
  id: serial("id").primaryKey(),
  bio: text("bio").notNull().default(""),
  profilePhoto: text("profile_photo"),
  sections: jsonb("sections").$type<{ id: string; title: string; content: string; type: 'text' | 'skills' | 'experience' | 'certifications'; }[]>().default([]),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertBlogSchema = createInsertSchema(blogs).omit({ id: true, createdAt: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertSettingSchema = createInsertSchema(settings).omit({ id: true });
export const insertAboutMeSchema = createInsertSchema(aboutMe).omit({ id: true, updatedAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Blog = typeof blogs.$inferSelect;
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type AboutMe = typeof aboutMe.$inferSelect;
export type InsertAboutMe = z.infer<typeof insertAboutMeSchema>;

export interface AboutMeSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'skills' | 'experience' | 'certifications';
}

export interface AboutMeContent {
  bio: string;
  profilePhoto: string;
  sections: AboutMeSection[];
}

export interface SiteSettings {
  logoUrl?: string;
  siteName: string;
  homeHeroTitle: string;
  homeHeroSub: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}
