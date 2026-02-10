import { db } from "./db";
import {
  users, blogs, courses, messages, settings, aboutMe,
  type User, type InsertUser,
  type Blog, type InsertBlog,
  type Course, type InsertCourse,
  type Message, type InsertMessage,
  type Setting, type InsertSetting,
  type AboutMe, type InsertAboutMe
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;

  // Blogs
  getBlogs(): Promise<Blog[]>;
  getBlog(id: number): Promise<Blog | undefined>;
  getBlogBySlug(slug: string): Promise<Blog | undefined>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog>;
  deleteBlog(id: number): Promise<void>;

  // Courses
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, updates: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;

  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;

  // Settings
  getSetting(key: string): Promise<Setting | undefined>;
  setSetting(key: string, value: any): Promise<Setting>;
  getAllSettings(): Promise<Setting[]>;

  // About Me
  getAboutMe(): Promise<AboutMe | undefined>;
  updateAboutMe(updates: Partial<InsertAboutMe>): Promise<AboutMe>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  // Blogs
  async getBlogs(): Promise<Blog[]> {
    return await db.select().from(blogs).orderBy(desc(blogs.createdAt));
  }

  async getBlog(id: number): Promise<Blog | undefined> {
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));
    return blog;
  }

  async getBlogBySlug(slug: string): Promise<Blog | undefined> {
    const [blog] = await db.select().from(blogs).where(eq(blogs.slug, slug));
    return blog;
  }

  async createBlog(blog: InsertBlog): Promise<Blog> {
    const [newBlog] = await db.insert(blogs).values(blog).returning();
    return newBlog;
  }

  async updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog> {
    const [updatedBlog] = await db.update(blogs).set(updates).where(eq(blogs.id, id)).returning();
    return updatedBlog;
  }

  async deleteBlog(id: number): Promise<void> {
    await db.delete(blogs).where(eq(blogs.id, id));
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses).orderBy(desc(courses.createdAt));
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: number, updates: Partial<InsertCourse>): Promise<Course> {
    const [updatedCourse] = await db.update(courses).set(updates).where(eq(courses.id, id)).returning();
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Messages
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  // Settings
  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting;
  }

  async setSetting(key: string, value: any): Promise<Setting> {
    const existing = await this.getSetting(key);
    if (existing) {
      const [updated] = await db.update(settings).set({ value }).where(eq(settings.key, key)).returning();
      return updated;
    }
    const [created] = await db.insert(settings).values({ key, value }).returning();
    return created;
  }

  async getAllSettings(): Promise<Setting[]> {
    return await db.select().from(settings);
  }

  // About Me
  async getAboutMe(): Promise<AboutMe | undefined> {
    const [aboutMeData] = await db.select().from(aboutMe);
    return aboutMeData;
  }

  async updateAboutMe(updates: Partial<InsertAboutMe>): Promise<AboutMe> {
    const existing = await this.getAboutMe();
    if (existing) {
      const [updated] = await db.update(aboutMe).set(updates).where(eq(aboutMe.id, existing.id)).returning();
      return updated;
    }
    const [created] = await db.insert(aboutMe).values({ ...updates, bio: updates.bio || "", sections: updates.sections || [] }).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
