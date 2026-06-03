import { Router } from 'express';
import { leadController } from '../controllers/leadController';
import { createLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Stats & Companies (before :id routes to avoid conflict)
router.get('/stats', leadController.getStats.bind(leadController));
router.get('/companies', leadController.getCompanies.bind(leadController));

// Search
router.get('/search', leadController.search.bind(leadController));

// CRUD
router.get('/', leadController.getAll.bind(leadController));
router.post('/', createLimiter, leadController.create.bind(leadController));
router.get('/:id', leadController.getById.bind(leadController));
router.put('/:id', leadController.update.bind(leadController));
router.delete('/:id', leadController.delete.bind(leadController));

export default router;
