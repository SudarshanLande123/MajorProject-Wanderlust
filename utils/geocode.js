const axios = require("axios");

async function geocodeLocation(location) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;

    const response = await axios.get(url, {
        headers: { "User-Agent": "WanderlustApp/1.0" }
    });

    if (!response.data || response.data.length === 0) {
        throw new Error("Location not found,Please Enter Correct Location!");
    }

    return {
        lat: parseFloat(response.data[0].lat),
        lon: parseFloat(response.data[0].lon)
    };
}

module.exports = geocodeLocation;
