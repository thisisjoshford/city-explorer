const express = require('express');
const services = require('./services');
const request = require('superagent');
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(cors());

let lat;  
let lng;

app.get('/location', async(req, respond, next) => {
    try { 
        const URL = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${req.query.search}&format=json`;
        const locationData = await request.get(URL);
        const res = locationData.body[0];

        lat = res.lat;
        lng = res.lon;

        const weather = await services.getWeatherData(lat, lng, request);
        const yelp = await services.getYelpData(lat, lng, request);
        const events = await services.getEvents(lat, lng, request);
        const trails = await services.getTrails(lat, lng, request);
    
        respond.json({
            city: res.display_name,
            lat,
            lng,
            weather,
            yelp,
            events,
            trails
        });
    } catch (err) {
        next(err);
    }
});

app.get('*', (req, res) => {
    res.send('404 NOT FOUND...');
});

module.exports = {
    app: app,
};
