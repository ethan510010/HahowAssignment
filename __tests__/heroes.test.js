const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);

/*
set jest timeout to 9000ms instead of default value 5000ms
, because sometimes third party api response from heroku will use about 7000 ~ 8000ms
*/
it('test no auth heroes api', async (done) => {
  const response = await request.get('/heroes');
  const heroObjKeys = Object.keys(response.body.heroes[0]);
  expect(heroObjKeys).toContain('id');
  expect(heroObjKeys).toContain('name');
  expect(heroObjKeys).toContain('image');
  expect(heroObjKeys).not.toContain('profile');
  done();
}, 9000);

it('test no auth single hero api', async (done) => {
  const heroId = '1';
  const response = await request.get(`/heroes/${heroId}`);
  expect(response.body.id).toBe(heroId);
  const heroObjKeys = Object.keys(response.body);
  expect(heroObjKeys).not.toContain('profile');
  done();
}, 9000);

it('test auth heroes api', async (done) => {
  const response = await request.get('/heroes').set('Name', 'hahow').set('Password', 'rocks');
  const heroObjKeys = Object.keys(response.body.heroes[0]);
  expect(heroObjKeys).toContain('id');
  expect(heroObjKeys).toContain('name');
  expect(heroObjKeys).toContain('image');
  expect(heroObjKeys).toContain('profile');
  done();
}, 9000);

it('test auth single hero api', async (done) => {
  const heroId = '1';
  const response = await request.get(`/heroes/${heroId}`).set('Name', 'hahow').set('Password', 'rocks');
  expect(response.body.id).toBe(heroId);
  const heroObjKeys = Object.keys(response.body);
  expect(heroObjKeys).toContain('id');
  expect(heroObjKeys).toContain('name');
  expect(heroObjKeys).toContain('image');
  expect(heroObjKeys).toContain('profile');
  done();
}, 9000);
