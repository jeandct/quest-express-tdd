const request = require('supertest');
const app = require('../app');
const connection = require('../connection');

describe('Test routes', () => {
  beforeEach((done) => connection.query('TRUNCATE TABLE bookmark', done));
  it('GET / send "Hello World" as JSON', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        const expected = { message: 'Hello World!' };
        expect(response.body).toEqual(expected);
        done();
      });
  });
  it('POST / send empty object', (done) => {
    request(app)
      .post('/bookmarks')
      .send({})
      .expect(422)
      .expect('Content-Type', /json/)
      .then((response) => {
        const expected = { error: 'required field(s) missing' };
        expect(response.body).toEqual(expected);
        done();
      });
  });
  it('POST / send data as JSON', (done) => {
    request(app)
      .post('/bookmarks')
      .send({ url: 'https://github.com/jeandct', title: 'github' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        const expected = {
          id: expect.any(Number),
          url: 'https://github.com/jeandct',
          title: 'github',
        };
        expect(response.body).toEqual(expected);
        done();
      });
  });
});

describe('GET /bookmarks/:id', () => {
  const testBookmark = { url: 'https://nodejs.org/', title: 'Node.js' };
  beforeEach((done) =>
    connection.query('TRUNCATE bookmark', () =>
      connection.query('INSERT INTO bookmark SET ?', testBookmark, done)
    )
  );
  it('GET / send no valid id', (done) => {
    request(app)
      .get('/bookmarks/13')
      .expect(404)
      .expect('Content-Type', /json/)
      .then((response) => {
        const expected = { error: 'Bookmark not found' };
        expect(response.body).toEqual(expected);
        done();
      });
  });
  it('GET / with valid id', (done) => {
    request(app)
      .get('/bookmarks/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).toEqual(testBookmark);
        done();
      });
  });
  // Write your tests HERE!
});
