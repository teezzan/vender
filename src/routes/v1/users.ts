import { Router } from 'express';

import { changePassword, login, register } from 'controllers/auth';
import { editUser, getUser, deleteUser, resetUserDeposit } from 'controllers/users';
import { depositCoin } from 'controllers/users/';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validatorChangePassword, validatorLogin, validatorRegister } from 'middleware/validation/auth';
import { validatorDepositCoin, validatorEdit } from 'middleware/validation/users';
import { Roles } from 'typeorm/entities/types';

const router = Router();

router.post('/login', [validatorLogin], login);

router.post('/register', [validatorRegister], register);

router.get('/', [checkJwt], getUser);

router.post('/change-password', [checkJwt, validatorChangePassword], changePassword);

router.post('/', [checkJwt, validatorEdit], editUser);

router.delete('/', [checkJwt], deleteUser);

router.post('/deposit', [checkJwt, validatorDepositCoin, checkRole([Roles.Buyer])], depositCoin);

router.get('/reset', [checkJwt, checkRole([Roles.Buyer])], resetUserDeposit);

export default router;
