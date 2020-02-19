//express allows us to to do paths
const express = require('express');
//get the json data and put that in geoData
const geoData = require('./geo.json');
//tells this app to run express!

const weather = require('./darksky.json')

const app = express();

console.log(geoData);

app.get('*', (req, res) => {
    res.json({
        ohNo: '404'

    });
});

//initialize the global state of late and long so its accessable in other routes
let lat;
let lng;

app.get('/location', (request, respond) => {
    //look at the query params and location
    const location = request.query.search; 
    //
    const cityData = geoData.results[0];
    //update the global state of lat and long so it is accessible in other routes
    lat = cityData.geometry.location.lat;
    long = cityData.geometry.location.lng;
   
    respond.json({
        formated_query: cityData.formatted_address,
        latitude: cityData.geometry.location.lat,
        longitude: cityData.geometry.location.lng

    });
});

app.get('/weather', (req, res){
    //use the lat and long from earlier to get weather data for the selected area
    const portlandWeather = getWeatherData(/*lat*lng*/);

    //respond with json in the appropriate form
    res.json(portlandWeather);
})

const getWeatherData = (lat,long) => {
    return weather.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time * 1000),
        };
    })
};

//must remove when starting test
app.listen(3001, () => console.log('running...'));
