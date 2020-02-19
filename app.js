require('dotenv').config();
//express allows us to to do paths
const express = require('express');
//tells this app to run express!

//use superagent to hit api... npm i superagent (async/await)
const request = require('superagent');
const port = process.env.PORT || 3000;
const cors = require('cors');
const app = express();


app.use(cors());

//initialize the global state of late and long so its accessable in other routes
let lat;
let lng;

// make sure your routes are in ORDER!!!!  ie 404 at the end

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

app.get('/weather', async(req, res, next) => {
    //use the lat and long from earlier to get weather data for the selected area
    try {
        const portlandWeather = await getWeatherData(lat, lng);
         
    //respond with json in the appropriate form
        res.json(portlandWeather);
    } catch (err) {
        next (err);
    }
});


app.get('*', (req, res) => {
    res.send('404 error... you done goofed...');
});


const getWeatherData = async(lat, lng) => {
    const URL = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${lng}`;
    const weather = await request.get(URL);

    return weather.body.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time * 1000),
        };
    })
};
//must remove when starting test
app.listen(port, () => console.log('running...'));
