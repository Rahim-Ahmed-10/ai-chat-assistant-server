import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';

const router = express.Router();

/**
 * POST /api/jwt
 * Accepts { email } in the request body.
 * Issues and returns a signed JWT token.
 * Used by social login flows (Google / GitHub) where the backend
 * hasn't issued a token yet but needs to establish a session.
 */
router.post('/', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required to issue a token' });
  }

  const token = jwt.sign(
    { email },
    config.jwt_secret,
    { expiresIn: config.jwt_expires_in }
  );

  return res.status(200).json({ success: true, token });
});

export const JwtRoutes = router;
