import { Router } from 'express';

import { changePassword, login, register } from 'controllers/auth';
import { getMe, editMe, deleteUser } from 'controllers/users';
import { checkJwt } from 'middleware/checkJwt';
import { validatorChangePassword, validatorLogin, validatorRegister } from 'middleware/validation/auth';
import { validatorEdit } from 'middleware/validation/users';

const router = Router();

router.post('/login', [validatorLogin], login);

router.post('/register', [validatorRegister], register);

router.get('/', [checkJwt], getMe);

router.post('/change-password', [checkJwt, validatorChangePassword], changePassword);

router.post('/', [checkJwt, validatorEdit], editMe);

router.delete('/', [checkJwt], deleteUser);

export default router;
