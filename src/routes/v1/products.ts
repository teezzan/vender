import { Router } from 'express';

import { getAllProducts, createProduct } from 'controllers/products';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validatorCreateProduct } from 'middleware/validation/products/validatorCreateProduct';
import { validatorEdit } from 'middleware/validation/users';
import { Roles } from 'typeorm/entities/types';

const router = Router();

router.get('/', [checkJwt], getAllProducts);

router.post('/', [checkJwt, checkRole([Roles.Seller]), validatorCreateProduct], createProduct);

// router.post('/', [checkJwt, validatorEdit], editMe);

// router.delete('/', [checkJwt], deleteUser);

export default router;
