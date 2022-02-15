import { Router } from 'express';

import { buyProduct, depositCoin, resetUserDeposit } from 'controllers/users';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validatorBuyProduct } from 'middleware/validation/products';
import { validatorDepositCoin } from 'middleware/validation/users';
import { Roles } from 'typeorm/entities/types';

import products from './products';
import users from './users';

const router = Router();

router.use('/users', users);
router.use('/products', products);

router.post('/deposit', [checkJwt, validatorDepositCoin, checkRole([Roles.Buyer])], depositCoin);
router.get('/reset', [checkJwt, checkRole([Roles.Buyer])], resetUserDeposit);
router.post('/buy', [checkJwt, checkRole([Roles.Buyer]), validatorBuyProduct], buyProduct);

export default router;
