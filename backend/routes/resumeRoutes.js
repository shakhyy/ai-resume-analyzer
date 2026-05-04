import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAuth } from '../middleware/auth.js';
import {
  downloadReport,
  generateImprovedResume,
  getResume,
  getResumeHistory,
  uploadResume
} from '../controllers/resumeController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only PDF and DOCX files are supported'));
    }

    cb(null, true);
  }
});

const router = Router();

router.use(requireAuth);
router.get('/', getResumeHistory);
router.post('/upload', upload.single('resume'), uploadResume);
router.get('/:id', getResume);
router.post('/:id/improve', generateImprovedResume);
router.get('/:id/report', downloadReport);

export default router;
