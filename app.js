require('dotenv').config();
//express allows us to to do paths
const express = require('express');
//tells this app to run express!
const weather = require('./darksky.json');
//use superagent to hit api... npm i superagent (async/await)
const request = require('superagent');
const cors = require('cors');
const app = express();


app.use(cors());

//initialize the global state of late and long so its accessable in other routes
let lat;
let lng;

// make sure your routes are in ORDER!!!!  ie 404 at the end

// middleware   -- you have a request 
// app.use((req, res, next) => {
//     req.josh = 'hi its josh';
//     req.params;
//     req.query;
//     req.body;
// });


app.get('/location', async(req, respond, next) => {
    try { //look at the query params and location
        const location = req.query.search; 
        //will use when we actually hit api
        console.log('using location...', location);

        //hide the key
        const URL = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${location}&format=json`;
        const locationData = await request.get(URL);
        //when you make a fetch, use .body property
        const firstResult = locationData.body[0];

        //update the global state of lat and long so it is accessible in other routes
        lat = firstResult.lat;
        lng = firstResult.log;
    
        respond.json({
            formated_query: firstResult.display_name,
            latitude: lat,
            longitude: lng,

        });
    } catch (err) {
        next(err);
    }
});

app.get('/weather', (req, res) => {
    //use the lat and long from earlier to get weather data for the selected area
    const portlandWeather = getWeatherData(/*lat*lng*/);

    //respond with json in the appropriate form
    res.json(portlandWeather);
});


app.get('*', (req, res) => {
    res.send('404 error... you done goofed...');
});


const getWeatherData = (lat, lng) => {
    return weather.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time * 1000),
        };
    })
};

//must remove when starting test
app.listen(3000, () => console.log('running...'));
