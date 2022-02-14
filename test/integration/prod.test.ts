import 'mocha';
import { expect } from 'chai';
import { agent as request } from 'supertest';
import { createConnection, getConnection, Entity, getRepository, Connection, Repository } from 'typeorm';

import { app } from '../../src/index';
import { Product } from '../../src/typeorm/entities/Product';
import { Roles } from '../../src/typeorm/entities/types';
import { User } from '../../src/typeorm/entities/User';
import { Stubs } from '../stubs/userStub';
const { sellerUserStub, buyerUserStub } = Stubs;

let dbConnection: Connection;
let userRepository: Repository<User>;

let sellerUserToken = null;
let buyerUserToken = null;

const sellerUser = new User();
sellerUser.username = sellerUserStub.username;
sellerUser.password = sellerUserStub.password;
sellerUser.role = Roles.Seller;
sellerUser.hashPassword();

const buyerUser = new User();
buyerUser.username = buyerUserStub.username;
buyerUser.password = buyerUserStub.password;
buyerUser.role = Roles.Buyer;
buyerUser.hashPassword();

beforeEach(async () => {
  dbConnection = await createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [User, Product],
    synchronize: true,
    logging: false,
  });
  userRepository = getRepository(User);
  await userRepository.save([sellerUser, buyerUser]);
  let res = await request(app)
    .post('/v1/users/login')
    .send({ username: sellerUser.username, password: sellerUser.password });
  sellerUserToken = res.body.data;

  res = await request(app).post('/v1/users/login').send({ username: buyerUser.username, password: buyerUser.password });
  buyerUserToken = res.body.data;
});

afterEach(async () => {
  await userRepository.delete([sellerUser.id, buyerUser.id]);
  const conn = getConnection();
  return conn.close();
});

describe('Test /product Endpoints', () => {
  it('should get all products empty by default', async () => {
    const res = await request(app).get('/v1/products/').set('Authorization', sellerUserToken);
    expect(res.status).to.equal(200);
    console.log(res);
  });
});
