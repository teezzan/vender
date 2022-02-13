import { Router } from 'express';

import products from './products';
import users from './users';

const router = Router();

router.use('/users', users);
router.use('/products', products);

export default router;
