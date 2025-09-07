import { Router } from 'express';
import { authMiddleware } from '../middleware/authmiddleware.js';
import * as customerController from '../controller/customercontroller.js';
import leadRoutes from './leadroutes.js';


const router = Router();
router.use(authMiddleware);


router.post('/', customerController.createCustomer);
router.get('/', customerController.listCustomers);
router.get('/:id', customerController.getCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);



router.use('/:customerId/leads', (req, res, next) => {

next();
}, leadRoutes);


export default router;