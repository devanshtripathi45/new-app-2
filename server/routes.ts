import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication first
  setupAuth(app);

  // === Blogs ===
  app.get(api.blogs.list.path, async (req, res) => {
    const blogs = await storage.getBlogs();
    res.json(blogs);
  });

  app.get(api.blogs.get.path, async (req, res) => {
    const blog = await storage.getBlogBySlug(req.params.slug);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  });

  app.post(api.blogs.create.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const input = api.blogs.create.input.parse(req.body);
      const blog = await storage.createBlog(input);
      res.status(201).json(blog);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.blogs.update.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const input = api.blogs.update.input.parse(req.body);
      const blog = await storage.updateBlog(Number(req.params.id), input);
      res.json(blog);
    } catch (err) {
      return res.status(404).json({ message: 'Blog not found' });
    }
  });

  app.delete(api.blogs.delete.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    await storage.deleteBlog(Number(req.params.id));
    res.status(204).end();
  });

  // === Courses ===
  app.get(api.courses.list.path, async (req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });

  app.get(api.courses.get.path, async (req, res) => {
    const course = await storage.getCourse(Number(req.params.id));
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  });

  app.post(api.courses.create.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const input = api.courses.create.input.parse(req.body);
      const course = await storage.createCourse(input);
      res.status(201).json(course);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.courses.update.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const input = api.courses.update.input.parse(req.body);
      const course = await storage.updateCourse(Number(req.params.id), input);
      res.json(course);
    } catch (err) {
      return res.status(404).json({ message: 'Course not found' });
    }
  });

  app.delete(api.courses.delete.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    await storage.deleteCourse(Number(req.params.id));
    res.status(204).end();
  });

  // === Messages ===
  app.post(api.messages.create.path, async (req, res) => {
    try {
      const input = api.messages.create.input.parse(req.body);
      const message = await storage.createMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.messages.list.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const messages = await storage.getMessages();
    res.json(messages);
  });

  // === User Profile Update ===
  app.patch(api.auth.updateProfile.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const input = api.auth.updateProfile.input.parse(req.body);
      const user = await storage.updateUser(req.user.id, input);
      res.json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Seed data
  await seedDatabase();

  return httpServer;
}

import { hashPassword } from "./auth";

async function seedDatabase() {
  const users = await storage.getUserByUsername('admin');
  if (!users) {
    const hashedPassword = await hashPassword('admin123');
    await storage.createUser({
      username: 'admin',
      password: hashedPassword,
      fullName: 'Network Admin',
      role: 'admin',
      bio: 'Senior Network Engineer & System Administrator'
    });
    
    const existingBlogs = await storage.getBlogs();
    if (existingBlogs.length === 0) {
      await storage.createBlog({
        title: "The Future of Network Engineering",
        slug: "future-of-network-engineering",
        content: "<p>Network engineering is evolving with AI and automation...</p>",
        isPublished: true,
        coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&q=80"
      });
      await storage.createBlog({
        title: "Understanding BGP Routing",
        slug: "understanding-bgp-routing",
        content: "<p>Border Gateway Protocol (BGP) is the standardized exterior gateway protocol designed to exchange routing and reachability information among autonomous systems (AS) on the Internet.</p>",
        isPublished: true,
        coverImage: "https://images.unsplash.com/photo-1558494949-efc02570fbc9?auto=format&fit=crop&q=80"
      });
    }

    const existingCourses = await storage.getCourses();
    if (existingCourses.length === 0) {
      await storage.createCourse({
        title: "CCNA Complete Guide",
        description: "Master the fundamentals of networking and prepare for the CCNA exam.",
        price: 4999, // $49.99
        coverImage: "https://images.unsplash.com/photo-1516245834210-c4c14278733f?auto=format&fit=crop&q=80",
        modules: [
          {
            title: "Network Fundamentals",
            lessons: [
              { title: "What is a Network?", content: "Video or text content here" },
              { title: "OSI Model", content: "Deep dive into OSI layers" }
            ]
          }
        ]
      });
    }
  }
}
