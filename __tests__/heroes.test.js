const supertest = require('supertest');
const app = require('../app');
const { closeInstance } = require('../db/redis');
const request = supertest(app);

/*
set jest timeout to 9000ms instead of default value 5000ms
, because sometimes third party api response from heroku will use about 7000 ~ 8000ms
*/
it('test no auth heroes api', async (done) => {
  const response = await request.get('/heroes');
  if (response.status !== 200) {
    const errorResKeys = Object.keys(response.body);
    expect(errorResKeys).toContain('message');
  } else {
    const heroObjKeys = Object.keys(response.body.heroes[0]);
    expect(heroObjKeys).toContain('id');
    expect(heroObjKeys).toContain('name');
    expect(heroObjKeys).toContain('image');
    expect(heroObjKeys).not.toContain('profile');
  }
  done();
}, 9000);

it('test no auth single hero api', async (done) => {
  const heroId = '1';
  const response = await request.get(`/heroes/${heroId}`);
  if (response.status !== 200) {
    const errorResKeys = Object.keys(response.body);
    expect(errorResKeys).toContain('message');
  } else {
    expect(response.body.id).toBe(heroId);
    const heroObjKeys = Object.keys(response.body);
    expect(heroObjKeys).not.toContain('profile');
  }
  done();
}, 9000);

it('test auth heroes api', async (done) => {
  const response = await request.get('/heroes').set('Name', 'hahow').set('Password', 'rocks');
  if (response.status !== 200) {
    const errorResKeys = Object.keys(response.body);
    expect(errorResKeys).toContain('message');
  } else {
    const heroObjKeys = Object.keys(response.body.heroes[0]);
    expect(heroObjKeys).toContain('id');
    expect(heroObjKeys).toContain('name');
    expect(heroObjKeys).toContain('image');
    expect(heroObjKeys).toContain('profile');
  }
  done();
}, 9000);

it('test auth single hero api', async (done) => {
  const heroId = '1';
  const response = await request.get(`/heroes/${heroId}`).set('Name', 'hahow').set('Password', 'rocks');
  if (response.status !== 200) {
    const errorResKeys = Object.keys(response.body);
    expect(errorResKeys).toContain('message');
  } else {
    expect(response.body.id).toBe(heroId);
    const heroObjKeys = Object.keys(response.body);
    expect(heroObjKeys).toContain('id');
    expect(heroObjKeys).toContain('name');
    expect(heroObjKeys).toContain('image');
    expect(heroObjKeys).toContain('profile');
  }
  done();
}, 9000);

afterAll(async (done) => {
  closeInstance();
  done();
});
