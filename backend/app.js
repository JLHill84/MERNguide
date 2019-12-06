const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");

const app = express();

//'places' routes...
app.use('/api/places', placesRoutes);

app.listen(5000);
