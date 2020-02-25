const { app } = require('./app.js');
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App live and listening on port ${port}!`));