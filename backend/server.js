const express = require('express');
const weatherRoutes = require('./routes/weatherRoute');
const cronJobs = require('./cronJob');
var cors = require('cors')

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: "https://venerable-fenglisu-8db204.netlify.app",
  methods: ['GET']
}));

app.use(express.json());

// routes
app.get('/', (req,res) => {
    res.json({message:"WeatherOnMap"})
})

app.use('/api/weather', weatherRoutes);

// Listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
