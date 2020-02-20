const { app } = require('../app.js');
const request = require('supertest');

describe('testing all paths', () => {
    test('test location path',
    // get the done function to call after the test
        async(done) => {
            // feed our express app to the supertest request
            const response = await request(app)
                // and hit out express app's about route with a /GET
                .get('/location/');
            // check to see if the response is what we expect
            expect(response.body).toEqual({
                formatted_query: expect.any(String),
                latitude: expect.any(String),
                longitude: expect.any(String)
            });
            // it should have a status of 200
            expect(response.statusCode).toBe(200);
            // the callback has a 'done' that we can call to fix stuff :sparkle-emoji:
            done();
        });
});
