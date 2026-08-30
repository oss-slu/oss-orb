import { Router } from 'express';
import { MMDDYY_HHMMSS } from '../utils/datetime';

const router = Router();

router.get('/health', (_req, res) => {
    res.json({
        ok: true,
        message: `express server is healthy at ${MMDDYY_HHMMSS(new Date())}`,
    });
});

export default router;
