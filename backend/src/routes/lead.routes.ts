import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbac } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { create, list, getLead, update, remove, exportLeads } from '../controllers/lead.controller';
import { leadSchema, leadUpdateSchema } from '../validators/lead.validator';

const router = Router();
router.use(authMiddleware);
router.get('/', list);
router.get('/export', exportLeads);
router.get('/:id', getLead);
router.post('/', validate(leadSchema), create);
router.put('/:id', validate(leadUpdateSchema), update);
router.delete('/:id', rbac(['admin']), remove);

export default router;