import { Router } from 'express';

import { changePassword, login, register } from 'controllers/auth';
import { editUser, getUser, deleteUser, resetUserDeposit } from 'controllers/users';
import { checkJwt } from 'middleware/checkJwt';
import { validatorChangePassword, validatorLogin, validatorRegister } from 'middleware/validation/auth';
import { validatorEdit } from 'middleware/validation/users';

const router = Router();

router.post('/login', [validatorLogin], login);

router.post('/register', [validatorRegister], register);

router.get('/', [checkJwt], getUser);

router.post('/change-password', [checkJwt, validatorChangePassword], changePassword);

router.post('/', [checkJwt, validatorEdit], editUser);

router.delete('/', [checkJwt], deleteUser);

export default router;
