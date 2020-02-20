const { app } = require('../app.js');
const request = require('supertest');

describe('testing all paths', () => {
    test('test location path',
    // get the done function to call after the test
        async(done) => {
            // feed our express app to the supertest request
            const response = await request(app)
                // and hit out express app's about route with a /GET
                .get('/location?search=Portland');
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
    test('weather path',
    // get the done function to call after the test
        async(done) => {
            // feed our express app to the supertest request
            const response = await request(app)
                // and hit out express app's about route with a /GET
                .get('/weather/');
            // check to see if the response is what we expect
            expect(response.body).toEqual([{
                forecast: expect.any(String),
                time: expect.any(String),
            },
            {
                forecast: expect.any(String),
                time: expect.any(String),
            },
            {
                forecast: expect.any(String),
                time: expect.any(String),
            },
            {
                forecast: expect.any(String),
                time: expect.any(String),
            },
            {
                forecast: expect.any(String),
                time: expect.any(String),
            },
            {
                forecast: expect.any(String),
                time: expect.any(String),
            },
            {
                forecast: expect.any(String),
                time: expect.any(String),
            },
            {
                forecast: expect.any(String),
                time: expect.any(String),
            },
            ]);
            // it should have a status of 200
            expect(response.statusCode).toBe(200);
            // the callback has a 'done' that we can call to fix stuff :sparkle-emoji:
            done();
        });
    test('test yelp',
    // get the done function to call after the test
        async(done) => {
            // feed our express app to the supertest request
            const response = await request(app)
                // and hit out express app's about route with a /GET
                .get('/yelp/');
            // check to see if the response is what we expect
            expect(response.body.results[0]).toEqual({
                name: expect.any(String),
                image_url: expect.any(String),
                price: expect.any(String),
                rating: expect.any(Number),
                url: expect.any(String)
            });
            // it should have a status of 200
            expect(response.statusCode).toBe(200);
            // the callback has a 'done' that we can call to fix stuff :sparkle-emoji:
            done();
        });

});
