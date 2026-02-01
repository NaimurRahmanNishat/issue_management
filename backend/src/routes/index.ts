// src/routes/index.ts
import { Router } from 'express';
import { userRoutes } from '../modules/users/user.routes';
import { statsRoutes } from '../modules/stats/stats.routes';
import { issueRoutes } from '../modules/issues/issue.routes';
import { reviewRoutes } from '../modules/comments/review.routes';
import { messageRoutes } from '../modules/message/message.routes';
import { authRoutes } from '../modules/auth/auth.routes';

const router = Router();

// Routes for handling module-related operations
const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes, // Route for handling authentication-related operations
  },
  {
    path: '/users',
    route: userRoutes, // Route for handling user-related operations
  },
  {
    path: '/issues',
    route: issueRoutes, // Route for handling user-related operations
  },
  {
    path: '/reviews',
    route: reviewRoutes, // Route for handling product-related operations
  },
  {
    path: '/messages',
    route: messageRoutes, // Route for handling product-related operations
  },
  {
    path: '/stats',
    route: statsRoutes, // Route for handling review-related operations
  },
];

// Add routes to the router
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;