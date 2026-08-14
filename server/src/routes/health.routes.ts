import { Router } from "express";

const router = Router();

router.get('/', (_, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
    });
});

export default router;