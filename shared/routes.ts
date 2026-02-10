import { z } from 'zod';
import { insertUserSchema, insertBlogSchema, insertCourseSchema, insertMessageSchema, users, blogs, courses, messages } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout' as const,
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    updateProfile: {
      method: 'PATCH' as const,
      path: '/api/user/profile' as const,
      input: insertUserSchema.partial().pick({ bio: true, profilePhoto: true, fullName: true }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    }
  },
  blogs: {
    list: {
      method: 'GET' as const,
      path: '/api/blogs' as const,
      responses: {
        200: z.array(z.custom<typeof blogs.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/blogs/:slug' as const,
      responses: {
        200: z.custom<typeof blogs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/blogs' as const,
      input: insertBlogSchema,
      responses: {
        201: z.custom<typeof blogs.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/blogs/:id' as const,
      input: insertBlogSchema.partial(),
      responses: {
        200: z.custom<typeof blogs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/blogs/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  courses: {
    list: {
      method: 'GET' as const,
      path: '/api/courses' as const,
      responses: {
        200: z.array(z.custom<typeof courses.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/courses/:id' as const,
      responses: {
        200: z.custom<typeof courses.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/courses' as const,
      input: insertCourseSchema,
      responses: {
        201: z.custom<typeof courses.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/courses/:id' as const,
      input: insertCourseSchema.partial(),
      responses: {
        200: z.custom<typeof courses.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/courses/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  messages: {
    create: {
      method: 'POST' as const,
      path: '/api/messages' as const,
      input: insertMessageSchema,
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/admin/messages' as const,
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
