require('dotenv').config();
//express allows us to to do paths
const express = require('express');
//use superagent to hit api... npm i superagent (async/await)
const request = require('superagent');
const cors = require('cors');
const app = express();
app.use(cors());

//initialize the global state of late and long so its accessible in other routes
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
        lng = firstResult.lon;
    
        respond.json({
            formatted_query: firstResult.display_name,
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

app.get('/yelp', async(req, res, next) => {
    //use the lat and long from earlier to get weather data for the selected area
    try {
        const yelpData = await request
            .get(`https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${lat}&longitude=${lng}`)
            .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`);

        const results = yelpData.body.businesses.map(business => {
            return {
                name: business.name,
                image_url: business.image_url,
                price: business.price,
                rating: business.rating,
                url: business.url,
            };
            
        });

        res.json({ results });
    } catch (err) {
        next (err);
    }
});

app.get('/trails', async(req, res, next) => {
    //use the lat and long from earlier to get weather data for the selected area
    try {
        const hikingData = await request
            .get(`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lng}&maxDistance=10&key=${process.env.HIKING_PROJECT_KEY}`);

        const results = hikingData.body.trails.map(hike => {
            const dateArray = hike.conditionDate.split(" ");
            const date = dateArray[0];
            const time = dateArray[1];

            return {
                name: hike.name,
                location: hike.location,
                length: hike.length,
                stars: hike.stars,
                star_votes: hike.star_votes,
                summary: hike.summary,
                trail_url: hike.url,
                conditions: hike.conditionStatus,
                condition_date: date,
                condition_time: time,
            };
            
        });

        res.json({ results });
    } catch (err) {
        next (err);
    }
});

app.get('/events', async(req, res, next) => {
//use the lat and long from earlier to get weather data for the selected area
    try {
        const eventData = await request
            .get(`http://api.eventful.com/json/events/search?app_key=${process.env.EVENT_API_KEY}&where=${lat},${lng}&within=25&page_size=20&page_number=1`);
        
        const nearbyEvents = JSON.parse(eventData.text);
        const totalEvents = nearbyEvents.total_items;
        const pageSize = nearbyEvents.page_size;
        const totalPages = nearbyEvents.page_count;

        const results = nearbyEvents.events.event.map(event => {
            const dateArray = event.start_time.split(" ");
            const date = dateArray[0];
            const time = dateArray[1];
        
            return {
                name: event.title,
                url: event.url,
                city: event.city_name,
                date: date,
                time: time,
                venue_name: event.venue_name,
                venue_address: event.venue_address,
                venue_url: event.venue_url
            };
            
        });

        res.json({ totalEvents, pageSize, totalPages, results });
    } catch (err) {
        next (err);
    }
});

app.get('*', (req, res) => {
    res.send('404 error... ಠ_ಠ  you done goofed! (ง •̀_•́)ง ');
});

const getWeatherData = async(lat, lng) => {
    const URL = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${lng}`;
    const weather = await request.get(URL);

    return weather.body.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time * 1000),
        };
    });
};

module.exports = {
    app: app,
};
