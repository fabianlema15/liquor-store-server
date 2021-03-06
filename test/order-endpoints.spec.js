const knex = require('knex')
const app = require('../src/app')
const helper = require('./test-helper');
const seedHelper = require('./seed-helper')
const bcrypt = require('bcryptjs')

describe('Orders Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helper.cleanTables(db))

  afterEach('cleanup', () => helper.cleanTables(db))

  describe('GET /', () => {
    context('GET All Orders Successful', () => {
      beforeEach('Fill Orders', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db));
      })

      it('Orders Successful', () => {
        return supertest(app)
          .get('/api/orders')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          .expect(res => {
            console.log(res.body);
          })
      })
    })
  })

  describe('GET /byuser/:user_id', () => {
    context('GET All Orders Successful', () => {
      beforeEach('Fill Orders', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db));
      })

      it('Orders Successful', () => {
        return supertest(app)
          .get('/api/orders/byuser/1')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          .expect(res => {
            console.log(res.body);
          })
      })
    })
  })

  describe('GET /:order_id', () => {
    context('GET Order Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db));
      })

      it('Order Successful', () => {
        return supertest(app)
          .get('/api/orders/1')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('POST /', () => {
    context('POST Order Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db));
      })

      it('Respons 400 when do not pass validation', () => {
        const newOrder = helper.makeOrdersArray()[0];
        newOrder.client_id = '';
        return supertest(app)
          .post('/api/orders')
          .set('Authorization', helper.makeAuthHeader())
          .send(newOrder)
          .expect(400)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })

      it('Respons 200 when created', () => {
        const newOrder = helper.makeOrdersArray()[0];
        return supertest(app)
          .post('/api/orders')
          .set('Authorization', helper.makeAuthHeader())
          .send(newOrder)
          .expect(201)
          .expect(res => {
            console.log(res.body);
          })
      })
    })
  })

  describe('PATCH /:order_id', () => {
    context('PATCH Order Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db));
      })

      it('Respons 400 when validated', () => {
        const newOrder = {
          subtotal: null,
          tax: 33.42,
          total: 55.32,
          observation: 'Left at the house'
        }
        return supertest(app)
          .patch('/api/orders/1')
          .set('Authorization', helper.makeAuthHeader())
          .send(newOrder)
          .expect(400)
          .expect(res => {
            console.log(res.body);
          })
      })

      it('Respons 200 when modified', () => {
        const newOrder = {
          user_id: 2,
          client_id: 2,
          subtotal: 14.54,
          tax: 33.42,
          total: 55.32,
          observation: 'Left at the house'
        }
        return supertest(app)
          .patch('/api/orders/1')
          .set('Authorization', helper.makeAuthHeader())
          .send(newOrder)
          .expect(204)
          .expect(res => {

          })
          .then(() => {
            return supertest(app)
              .get('/api/orders/1')
              .set('Authorization', helper.makeAuthHeader())
              .expect(200)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

  describe('DELETE /:order_id', () => {
    context('DELETE Order Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db));
      })

      it('Respons 200 when inactivated', () => {
        return supertest(app)
          .delete('/api/orders/1')
          .set('Authorization', helper.makeAuthHeader())
          .expect(204)
          .expect(res => {

          })
          .then(() => {
            return supertest(app)
              .get('/api/orders/1')
              .set('Authorization', helper.makeAuthHeader())
              .expect(404)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

  describe('GET /:order_id/products/', () => {
    context('GET All Orders Product Successful', () => {
      beforeEach('Fill Orders', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db))
            .then(() => seedHelper.seedProducts(db))
            .then(() => seedHelper.seedOrderProduct(db));
      })

      it('Orders Successful', () => {
        return supertest(app)
          .get('/api/orders/1/products')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          .expect(res => {
            console.log(res.body);
          })
      })
    })
  })

  describe('GET /:order_id/products/:producto_id', () => {
    context('GET Order Product Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db))
            .then(() => seedHelper.seedProducts(db))
            .then(() => seedHelper.seedOrderProduct(db));
      })

      it('Order Successful', () => {
        return supertest(app)
          .get('/api/orders/1/products/1')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          .expect(res => {
            console.log(res.body);
          })
      })
    })
  })

  describe('POST /:order_id/products', () => {
    context('POST Order Product Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db))
            .then(() => seedHelper.seedProducts(db));
      })

      it('Respons 400 when do not pass validation', () => {
        const newProduct = helper.makeOrderProductArray()[0];
        newProduct.quantity = null;
        return supertest(app)
          .post('/api/orders/1/products')
          .set('Authorization', helper.makeAuthHeader())
          .send(newProduct)
          .expect(400)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })

      it('Respons 200 when created', () => {
        const newProduct = helper.makeOrderProductArray()[0];
        //console.log(helper.makeProductsArray()[0]);
        return supertest(app)
          .post('/api/orders/1/products')
          .set('Authorization', helper.makeAuthHeader())
          .send(newProduct)
          .expect(201)
          .expect(res => {
            console.log(res.body);
          })
          /*.then(() => supertest(app)
            .get('/api/products/1')
            .expect(200)
            .expect(ress => {
              console.log(ress.body)
            })
          )*/
      })
    })

    context('POST Order Product Exist', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db))
            .then(() => seedHelper.seedProducts(db))
            .then(() => seedHelper.seedOrderProduct(db));
      })

      it('Respons 400 when order and product exist', () => {
        const newProduct = helper.makeOrderProductArray()[0];
        return supertest(app)
          .post('/api/orders/1/products')
          .set('Authorization', helper.makeAuthHeader())
          .send(newProduct)
          .expect(400)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('PATCH /:order_id/products/:producto_id', () => {
    context('PATCH Order Product Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db))
            .then(() => seedHelper.seedProducts(db))
            .then(() => seedHelper.seedOrderProduct(db));
      })

      it('Respons 400 when validated product', () => {
        const newPromotion = {
          quantity: null
        }
        return supertest(app)
          .patch('/api/orders/1/products/1')
          .set('Authorization', helper.makeAuthHeader())
          .send(newPromotion)
          .expect(400)
          .expect(res => {
            console.log(res.body);
          })
      })

      it('Respons 200 when modified', () => {
        const newOrder = {
          quantity: 100,
          price: 2,
          observation: '343'
        }
        return supertest(app)
          .patch('/api/orders/1/products/1')
          .set('Authorization', helper.makeAuthHeader())
          .send(newOrder)
          .expect(204)
          .expect(res => {

          })
          .then(() => {
            return supertest(app)
              .get('/api/orders/1/products/1')
              .set('Authorization', helper.makeAuthHeader())
              .expect(200)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

  describe('DELETE /:order_id/products/:producto_id', () => {
    context('DELETE Order Product Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db))
            .then(() => seedHelper.seedProducts(db))
            .then(() => seedHelper.seedOrderProduct(db));
      })

      it('Respons 200 when deleted', () => {
        return supertest(app)
          .delete('/api/orders/1/products/1')
          .set('Authorization', helper.makeAuthHeader())
          .expect(201)
          .expect(res => {
            console.log(res.body);
          })
          .then(() => {
            return supertest(app)
              .get('/api/orders/1/products/1')
              .set('Authorization', helper.makeAuthHeader())
              .expect(404)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

  describe('GET /:order_id/promotions/', () => {
    context('GET All Orders promotions Successful', () => {
      beforeEach('Fill Orders', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db))
            .then(() => seedHelper.seedPromotions(db))
            .then(() => seedHelper.seedOrderPromotion(db));
      })

      it('Orders Successful', () => {
        return supertest(app)
          .get('/api/orders/1/promotions')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          .expect(res => {
            console.log(res.body);
          })
      })
    })
  })

  describe('GET /:order_id/promotions/:promotion_id', () => {
    context('GET Order Product Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db))
            .then(() => seedHelper.seedPromotions(db))
            .then(() => seedHelper.seedOrderPromotion(db));
      })

      it('Order Successful', () => {
        return supertest(app)
          .get('/api/orders/1/promotions/1')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })
  })

  describe('POST /:order_id/promotions', () => {
    context('POST Order Product Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db))
            .then(() => seedHelper.seedPromotions(db));
      })

      it('Respons 400 when do not pass validation', () => {
        const newProduct = helper.makeOrderPromotionArray()[0];
        newProduct.quantity = null;
        return supertest(app)
          .post('/api/orders/1/promotions')
          .set('Authorization', helper.makeAuthHeader())
          .send(newProduct)
          .expect(400)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })

      it('Respons 200 when created', () => {
        const newProduct = helper.makeOrderPromotionArray()[0];
        return supertest(app)
          .post('/api/orders/1/promotions')
          .set('Authorization', helper.makeAuthHeader())
          .send(newProduct)
          .expect(201)
          /*.expect(res => {
            console.log(res.body);
          })*/
      })
    })

    context('POST Order Promotion Exist', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db))
            .then(() => seedHelper.seedPromotions(db))
            .then(() => seedHelper.seedOrderPromotion(db));
      })

      it('Respons 400 when order and promotion exist', () => {
        const newProduct = helper.makeOrderPromotionArray()[0];
        return supertest(app)
          .post('/api/orders/1/promotions')
          .set('Authorization', helper.makeAuthHeader())
          .send(newProduct)
          .expect(400)
          .expect(res => {
            console.log(res.body);
          })
      })
    })
  })

  describe('PATCH /:order_id/promotions/:promotion_id', () => {
    context('PATCH Order Product Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db))
            .then(() => seedHelper.seedPromotions(db))
            .then(() => seedHelper.seedOrderPromotion(db));
      })

      it('Respons 400 when validated product', () => {
        const newPromotion = {
          quantity: null
        }
        return supertest(app)
          .patch('/api/orders/1/promotions/1')
          .set('Authorization', helper.makeAuthHeader())
          .send(newPromotion)
          .expect(400)
          .expect(res => {
            console.log(res.body);
          })
      })

      it('Respons 200 when modified', () => {
        const newOrder = {
          quantity: 100,
          price: 2,
          observation: '343'
        }
        return supertest(app)
          .patch('/api/orders/1/promotions/1')
          .set('Authorization', helper.makeAuthHeader())
          .send(newOrder)
          .expect(204)
          .expect(res => {

          })
          .then(() => {
            return supertest(app)
              .get('/api/orders/1/promotions/1')
              .set('Authorization', helper.makeAuthHeader())
              .expect(200)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

  describe('DELETE /:order_id/promotions/:promotion_id', () => {
    context('DELETE Order Product Successful', () => {
      beforeEach('Fill roles', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db))
            .then(() => seedHelper.seedPromotions(db))
            .then(() => seedHelper.seedOrderPromotion(db));
      })

      it('Respons 200 when deleted', () => {
        return supertest(app)
          .delete('/api/orders/1/promotions/1')
          .set('Authorization', helper.makeAuthHeader())
          .expect(201)
          .expect(res => {
            console.log(res.body);
          })
          .then(() => {
            return supertest(app)
              .get('/api/orders/1/promotions/1')
              .set('Authorization', helper.makeAuthHeader())
              .expect(404)
              /*.expect(res => {
                console.log(res.body);
              })*/
          })
      })
    })
  })

  describe('GET /filter/:user_id/:from/:to', () => {
    context('GET All Sales Filtered User Successful', () => {
      beforeEach('Fill sales', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db))
      })

      it('Sales Successful', () => {
        return supertest(app)
          .get('/api/orders/filter/2/2018-01-22/2029-01-23')
          .set('Authorization', helper.makeAuthHeader())
          .expect(200)
          .expect(res => {
            console.log(res.body);
          })
      })
    })
  })

  describe.skip('Post Send Mail /api/orders/sendmail', () => {
    context('Send Mail Successful', () => {
      beforeEach('Fill sales', () => {
        return seedHelper.seedUsers(db)
            .then(() => seedHelper.seedClients(db))
            .then(() => seedHelper.seedOrders(db))
      })

      it('Sales Successful', () => {
        const newMail = {
          mail_to: 'fabianlemac@gmail.com',
          user_id: 1,
          from: '2018-01-22',
          to: '2029-01-23'
        }
        return supertest(app)
          .post('/api/orders/send/mail')
          .set('Authorization', helper.makeAuthHeader())
          .send(newMail)
          .expect(201)
          .expect(res => {
            console.log(res.body);
          })
      })
    })
  })

})
