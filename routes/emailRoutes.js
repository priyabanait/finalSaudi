import express from 'express';
import { saveEmail } from '../controllers/emailController.js';

import fs from 'fs';
import path from 'path';

const router = express.Router();
router.post('/save-email', saveEmail);

// GET /emails - return all saved emails for dashboard
router.get('/emails', (req, res) => {
	const emailsFile = path.join(process.cwd(), 'Backend-lokesh', 'emails.json');
	try {
		if (!fs.existsSync(emailsFile)) {
			return res.json([]);
		}
		const data = fs.readFileSync(emailsFile, 'utf-8');
		const emails = JSON.parse(data);
		res.json(emails);
	} catch (err) {
		res.status(500).json({ error: 'Failed to read emails.' });
	}
});

export default router;
