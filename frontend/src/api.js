export async function fetchLatestWeatherData() {
    try {
        const response = await fetch('/api/weather');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error; 
    }
}

export async function fetchLastRecords(districtName,records) {
    try {
      const response = await fetch(`/api/weather/${districtName}/${records}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching last records for ${districtName}:`, error);
      throw error;
    }
  }