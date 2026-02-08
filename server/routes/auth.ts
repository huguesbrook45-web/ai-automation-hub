import express, { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';

const router = express.Router();

/**
 * GET /api/auth/me
 * Get current user information
 */
router.get('/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
  });
});

/**
 * POST /api/auth/logout
 * Logout current user
 */
router.post('/logout', (req: AuthenticatedRequest, res: Response) => {
  // Clear session/JWT token
  res.clearCookie('auth_token');
  res.json({ success: true });
});

/**
 * POST /api/auth/callback
 * OAuth callback handler
 */
router.post('/callback', async (req: Request, res: Response) => {
  try {
    const { code, state } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
    }

    // TODO: Exchange code for token with OAuth provider
    // TODO: Create or update user in database
    // TODO: Set session/JWT token

    res.json({ success: true });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

export default router;
