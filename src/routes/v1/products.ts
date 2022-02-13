import { Router } from 'express';

import {
  getAllProducts,
  createProduct,
  updateProduct,
  getProduct,
  getUserProducts,
  deleteProduct,
} from 'controllers/products';
import { buyProduct } from 'controllers/users';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import {
  validatorUpdateProduct,
  validatorCreateProduct,
  validatorRestockProduct,
  validatorBuyProduct,
} from 'middleware/validation/products';
import { Roles } from 'typeorm/entities/types';

const router = Router();

router.get('/', [checkJwt], getAllProducts);

router.get('/me/', [checkJwt, checkRole([Roles.Seller])], getUserProducts);

router.get('/:id', [checkJwt], getProduct);

router.post('/', [checkJwt, checkRole([Roles.Seller]), validatorCreateProduct], createProduct);

router.put('/restock/:id', [checkJwt, checkRole([Roles.Seller]), validatorRestockProduct], updateProduct);

router.put('/:id', [checkJwt, checkRole([Roles.Seller]), validatorUpdateProduct], updateProduct);

router.delete('/:id', [checkJwt, checkRole([Roles.Seller])], deleteProduct);

router.post('/buy', [checkJwt, checkRole([Roles.Buyer]), validatorBuyProduct], buyProduct);

export default router;
