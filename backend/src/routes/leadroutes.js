import { Router } from 'express';
import * as leadController from '../controller/leadcontroller.js';
import { authMiddleware } from '../middleware/authmiddleware.js';


const router = Router({ mergeParams: true });


router.post('/',authMiddleware, leadController.createLead);
router.get('/', leadController.listLeads);
router.put('/:leadId', leadController.updateLead);
router.delete('/:leadId', leadController.deleteLead);


export default router;