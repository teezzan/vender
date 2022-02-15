import 'mocha';
import { expect } from 'chai';
import { agent as request } from 'supertest';
import { getRepository, Connection, Repository } from 'typeorm';

import { app } from '../../src/index';
import { dbCreateConnection } from '../../src/typeorm/dbCreateConnection';
import { Product } from '../../src/typeorm/entities/Product';
import { Roles } from '../../src/typeorm/entities/types';
import { User } from '../../src/typeorm/entities/User';
import { Stubs } from '../stubs';
const { sellerUserStub, buyerUserStub, productStub } = Stubs;

describe('API Tests', () => {
  let dbConnection: Connection;
  let userRepository: Repository<User>;
  let productRepository: Repository<Product>;
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

  before(async () => {
    dbConnection = await dbCreateConnection();
    userRepository = getRepository(User);
    productRepository = getRepository(Product);
    await userRepository.delete({});
    await productRepository.delete({});
  });

  after(async () => {
    await userRepository.delete({});
    await productRepository.delete({});
  });

  beforeEach(async () => {
    const a = await userRepository.save([sellerUser, buyerUser]);
    let res = await request(app)
      .post('/v1/users/login')
      .send({ username: sellerUserStub.username, password: sellerUserStub.password });
    sellerUserToken = res.body.data;

    res = await request(app)
      .post('/v1/users/login')
      .send({ username: buyerUserStub.username, password: buyerUserStub.password });
    buyerUserToken = res.body.data;
  });

  afterEach(async () => {
    await userRepository.delete({});
    await productRepository.delete({});
  });

  describe('Test /product CRUD Endpoints', () => {
    it('should get all products empty by default', async () => {
      const res = await request(app).get('/v1/products/').set('Authorization', sellerUserToken);
      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.lengthOf(0);
    });
    it('should allow all products accessible by everyone by default', async () => {
      let res = await request(app).get('/v1/products/').set('Authorization', buyerUserToken);
      expect(res.status).to.equal(200);

      res = await request(app).get('/v1/products/').set('Authorization', sellerUserToken);
      expect(res.status).to.equal(200);
    });

    it('should allow products to be added by Seller', async () => {
      let res = await request(app).post('/v1/products/').set('Authorization', sellerUserToken).send(productStub[0]);
      expect(res.status).to.equal(201);

      res = await request(app).get('/v1/products/').set('Authorization', sellerUserToken);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.not.have.lengthOf(0);
      expect(res.body.data[0].cost).to.equal(productStub[0].cost);
      expect(res.body.data[0].amountAvailable).to.equal(productStub[0].amount);
      expect(res.body.data[0].productName).to.equal(productStub[0].productName);
    });

    it('should allow products to be updated by Seller', async () => {
      let res = await request(app).post('/v1/products/').set('Authorization', sellerUserToken).send(productStub[0]);
      expect(res.status).to.equal(201);

      res = await request(app)
        .put(`/v1/products/${res.body.data.id}`)
        .set('Authorization', sellerUserToken)
        .send({
          ...productStub[1],
        });

      expect(res.status).to.equal(200);
      expect(res.body.data.cost).to.equal(productStub[1].cost);
      expect(res.body.data.amountAvailable).to.equal(productStub[1].amount);
      expect(res.body.data.productName).to.equal(productStub[1].productName);
    });

    it('should allow products to be deleted by Seller', async () => {
      let res = await request(app).post('/v1/products/').set('Authorization', sellerUserToken).send(productStub[0]);
      expect(res.status).to.equal(201);

      res = await request(app).delete(`/v1/products/${res.body.data.id}`).set('Authorization', sellerUserToken);

      expect(res.status).to.equal(200);

      res = await request(app).get('/v1/products/').set('Authorization', sellerUserToken);
      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.lengthOf(0);
    });
  });

  describe('Product API Validation Tests', () => {
    it('should not allow products cost that are not multiple of 5', async () => {
      const product = {
        ...productStub[0],
        cost: 4,
      };
      const res = await request(app).post('/v1/products/').set('Authorization', sellerUserToken).send(product);
      expect(res.status).to.equal(400);
      expect(res.body).to.contain({
        errorType: 'Validation',
        errorMessage: '"cost" must be a multiple of 5',
      });
    });

    it('should not allow arguments of negative input', async () => {
      const product = {
        ...productStub[0],
        cost: -4,
      };
      const res = await request(app).post('/v1/products/').set('Authorization', sellerUserToken).send(product);
      expect(res.status).to.equal(400);
      expect(res.body).to.contain({
        errorType: 'Validation',
        errorMessage: '"cost" must be a positive number',
      });
    });
  });

  describe('Product API Access Tests', () => {
    it('should not allow products to be added by Buyer', async () => {
      let res = await request(app).post('/v1/products/').set('Authorization', buyerUserToken).send(productStub[0]);
      expect(res.status).to.equal(401);

      res = await request(app).get('/v1/products/').set('Authorization', sellerUserToken);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.lengthOf(0);
    });

    it('should not allow products to be updated by Buyer', async () => {
      let res = await request(app).post('/v1/products/').set('Authorization', sellerUserToken).send(productStub[0]);
      expect(res.status).to.equal(201);

      res = await request(app).post('/v1/products/').set('Authorization', buyerUserToken).send(productStub[0]);
      expect(res.status).to.equal(401);
    });

    it('should not allow products to be deleted by Buyer', async () => {
      let res = await request(app).post('/v1/products/').set('Authorization', sellerUserToken).send(productStub[0]);
      expect(res.status).to.equal(201);

      res = await request(app).delete(`/v1/products/${res.body.data.id}`).set('Authorization', buyerUserToken);
      expect(res.status).to.equal(401);
    });
  });

  describe('Test /deposit Endpoint', () => {
    beforeEach(async () => {
      await request(app).post('/v1/products/').set('Authorization', sellerUserToken).send(productStub[0]);
      await request(app).post('/v1/products/').set('Authorization', sellerUserToken).send(productStub[1]);
    });

    it('should allow user to deposit', async () => {
      const res = await request(app).post('/v1/deposit').set('Authorization', buyerUserToken).send({ coin: 'Five' });
      expect(res.status).to.equal(200);
      expect(res.body.data.total).to.equal(5);
      expect(res.body.data.deposit).to.not.have.lengthOf(0);
      expect(res.body.data.deposit[0]).to.contain({
        quantity: 1,
        denomination: 5,
      });
    });

    it('should allow user to deposit only enum values', async () => {
      const res = await request(app).post('/v1/deposit').set('Authorization', buyerUserToken).send({ coin: 'Three' });
      expect(res.status).to.equal(400);
      expect(res.body).to.contain({
        errorType: 'Validation',
        errorMessage: '"coin" must be one of [Five, Ten, Twenty, Fifty, Hundred]',
      });
    });
  });

  describe('Test /buy Endpoint', () => {
    let product1;
    let product2;
    const num = 2;
    beforeEach(async () => {
      await request(app).post('/v1/deposit').set('Authorization', buyerUserToken).send({ coin: 'Five' });
      await request(app).post('/v1/deposit').set('Authorization', buyerUserToken).send({ coin: 'Five' });
      await request(app).post('/v1/deposit').set('Authorization', buyerUserToken).send({ coin: 'Ten' });
      await request(app).post('/v1/deposit').set('Authorization', buyerUserToken).send({ coin: 'Fifty' });

      let res = await request(app).post('/v1/products/').set('Authorization', sellerUserToken).send(productStub[0]);
      product1 = res.body.data;
      res = await request(app).post('/v1/products/').set('Authorization', sellerUserToken).send(productStub[1]);
      product2 = res.body.data;
    });

    it('should allow user to buy', async () => {
      const res = await request(app).post('/v1/buy').set('Authorization', buyerUserToken).send({
        productId: product1.id,
        amountOfProduct: num,
      });
      expect(res.status).to.equal(200);
      expect(res.body.data.totalCost).to.equal(product1.cost * num);
      const change = res.body.data.change.sort((a, b) => a.denomination - b.denomination);
      expect(change[0].denomination).to.be.equal(5);
      expect(change[0].quantity).to.be.equal(2);
    });

    it('should check for insufficient credit', async () => {
      const res = await request(app).post('/v1/buy').set('Authorization', buyerUserToken).send({
        productId: product2.id,
        amountOfProduct: num,
      });
      expect(res.status).to.equal(400);
      expect(res.body.errorMessage).to.equal('Deposit Insufficient.');
    });
    it('should return error for unavailable item', async () => {
      const res = await request(app)
        .post('/v1/buy')
        .set('Authorization', buyerUserToken)
        .send({
          productId: product2.id + 10,
          amountOfProduct: num,
        });
      expect(res.status).to.equal(404);
      expect(res.body.errorMessage).to.equal('Product not found.');
    });
    it('should return error for negative item amount', async () => {
      const res = await request(app)
        .post('/v1/buy')
        .set('Authorization', buyerUserToken)
        .send({
          productId: product2.id + 10,
          amountOfProduct: -1 * num,
        });
      expect(res.status).to.equal(400);
      expect(res.body.errorMessage).to.equal('"amountOfProduct" must be a positive number');
    });
    it('should return error due to change problems', async () => {
      const res = await request(app).post('/v1/buy').set('Authorization', buyerUserToken).send({
        productId: product1.id,
        amountOfProduct: 9,
      });
      expect(res.status).to.equal(500);
      expect(res.body.errorMessage).to.equal('Deficit of 25cent remaining. Aborting!');
    });
  });
});
