const getYelpData = async(lat, lng, request) => {
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
    return ({ results });
};

const getEvents = async(lat, lng, request) => { 
    const eventData = await request
        .get(`http://api.eventful.com/json/events/search?app_key=${process.env.EVENT_API_KEY}&where=${lat},${lng}&within=25&page_size=20&page_number=1`);

    const nearbyEvents = JSON.parse(eventData.text);
    const totalEvents = nearbyEvents.total_items;
    const pageSize = nearbyEvents.page_size;
    const totalPages = nearbyEvents.page_count;

    const results = nearbyEvents.events.event.map(event => {
        const dateArray = event.start_time.split(' ');
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
    return ({ totalEvents, pageSize, totalPages, results });
};

const getTrails = async(lat, lng, request) => {
    const hikingData = await request
        .get(`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lng}&maxDistance=10&key=${process.env.HIKING_PROJECT_KEY}`);

    const results = hikingData.body.trails.map(hike => {
        const dateArray = hike.conditionDate.split(' ');
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
    return ({ results });
};

const getWeatherData = async(lat, lng, request) => {
    const URL = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${lng}`;
    const weather = await request.get(URL);

    return weather.body.daily.data.map(forecast => {
        const date = new Date(forecast.time * 1000);
        const day = date.getUTCDay();

        let dayOfWeek;
        if (day === 0) dayOfWeek = 'Sun';
        if (day === 1) dayOfWeek = 'Mon';
        if (day === 2) dayOfWeek = 'Tue';
        if (day === 3) dayOfWeek = 'Wed';
        if (day === 4) dayOfWeek = 'Thur';
        if (day === 5) dayOfWeek = 'Fri';
        if (day === 6) dayOfWeek = 'Sat';

        return {
            high: forecast.temperatureHigh,
            low: forecast.temperatureLow,
            precip: forecast.precipProbability,
            icon: forecast.icon,
            summary: forecast.summary,
            time: dayOfWeek
        };
    });
};

module.exports = {
    getEvents, 
    getTrails,
    getWeatherData,
    getYelpData
};
