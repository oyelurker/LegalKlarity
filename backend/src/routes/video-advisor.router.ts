import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middlewares/auth';

// Extend Express Request type to include 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const videoAdvisorRouter = Router();

// Mock function to generate a temporary video room URL
// In a real implementation, this would call the Daily.co API
const generateVideoRoom = (userId: string, advisorId?: string) => {
  // In a real implementation, this would call the Daily.co API
  // For now, we'll return a mock URL with a unique identifier
  const roomId = `legal-session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  // This would be the real Daily.co room URL in production
  // const roomUrl = `https://${process.env.DAILY_SUBDOMAIN || 'api'}.daily.co/${roomId}`;
  
  return {
    roomId,
    url: `https://api.daily.co/${roomId}`, // Mock URL
    token: `mock-token-${Date.now()}`,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Expires in 1 hour
  };
};

/**
 * POST /video-advisor/create-room
 * Creates a new video advisor room
 */
videoAdvisorRouter.post(
  '/create-room',
  authenticate,
  [
    body('advisorId').optional().isString().withMessage('Advisor ID must be a string'),
    body('duration').optional().isInt({ min: 15, max: 300 }).withMessage('Duration must be between 15 and 300 minutes'),
  ],
  (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { advisorId, duration } = req.body;
      const userId = (req as any).user?.uid; // Type assertion for auth middleware

      // Generate the video room
      const room = generateVideoRoom(userId, advisorId);

      res.status(200).json({
        success: true,
        message: 'Video room created successfully',
        data: {
          room,
          advisorId: advisorId || 'default-legal-advisor',
        },
      });
    } catch (error) {
      console.error('Error creating video room:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

/**
 * POST /video-advisor/join-room
 * Returns room details for a user to join
 */
videoAdvisorRouter.post(
  '/join-room',
  authenticate,
  [
    body('roomId').notEmpty().withMessage('Room ID is required'),
  ],
  (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { roomId } = req.body;
      const userId = (req as any).user?.uid; // Type assertion for auth middleware

      // In a real implementation, verify the user has access to this room
      // For mock, we'll just return the room details
      const room = {
        roomId,
        url: `https://api.daily.co/${roomId}`, // Mock URL
        token: `mock-token-${Date.now()}`,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Expires in 1 hour
      };

      res.status(200).json({
        success: true,
        message: 'Room details retrieved successfully',
        data: { room },
      });
    } catch (error) {
      console.error('Error joining video room:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

/**
 * POST /video-advisor/end-session
 * Ends a video advisor session
 */
videoAdvisorRouter.post(
  '/end-session',
  authenticate,
  [
    body('roomId').notEmpty().withMessage('Room ID is required'),
  ],
  (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { roomId } = req.body;
      const userId = (req as any).user?.uid; // Type assertion for auth middleware

      // In a real implementation, this would call the Daily.co API to end the room
      // For mock, we'll just return success

      res.status(200).json({
        success: true,
        message: 'Video session ended successfully',
      });
    } catch (error) {
      console.error('Error ending video session:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

export default videoAdvisorRouter;