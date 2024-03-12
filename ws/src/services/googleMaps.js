const axios = require('axios');

const api = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api',
});

const google_maps_api = require('../data/keys.json').google_maps_api;

module.exports = {
  getPlaces: async (address) => {
    try {
      const response = await api.get(
        `/place/autocomplete/json?input=${address}&key=${google_maps_api}`
      );
      return { error: false, data: response.data };
    } catch (err) {
      return { error: true, message: err.message };
    }
  },
  getPlaceDetail: async (placeid) => {
    try {
      //https://maps.googleapis.com/maps/api/place/details/json?placeid={placeid}&key={key}
      const response = await api.get(
        `/api/place/details/json?placeid=${placeid}&key=${google_maps_api}`
      );
      return { error: false, data: response.data };
    } catch (err) {
      return { error: true, message: err.message };
    }
  },
  getRoute: async (origin, destination) => {
    try {
      const response = await api.get(
        `/directions/json?origin=place_id:${origin}&destination=place_id:${destination}&key=${google_maps_api}`
      );
      return { error: false, data: response.data };
    } catch (err) {
      return { error: true, message: err.message };
    }
  },
};
