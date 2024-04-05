const cron = require('node-cron');

const districts = ['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee', 'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Moneragala', 'Ratnapura', 'Kegalle'];

// Function to generate random weather data
const generateRandomData = (district) => {
  const temperature = Math.random() * (40 - 20) + 20; 
  const humidity = Math.random() * (100 - 50) + 50; 
  const air_pressure = Math.random() * (1050 - 950) + 950;

  return { district: district, temperature: temperature, humidity: humidity, air_pressure: air_pressure};
};

// Function to send POST request to the API
const sendPostRequest = async () => {
    const fetch = await import('node-fetch');
    for (const district of districts) {
        try {
            const weatherData = generateRandomData(district);
            const response = await fetch.default('http://localhost:4000/api/weather', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(weatherData),
            });
            if (!response.ok) {
              throw new Error(`Failed to send data: ${response.statusText}`);
            }
            console.log(`Weather data for ${district} posted successfully.`);
          } catch (error) {
            console.error('Error sending data:', error.message);
          }
        
      }
};

// Schedule the cron job to run every 5 minutes
cron.schedule('*/1 * * * *', async () => {
  console.log('Sending data to API...');
  await sendPostRequest();
});
