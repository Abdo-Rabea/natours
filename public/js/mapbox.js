/* eslint-disable */
const locations = JSON.parse(map.dataset.locations);
console.log(locations);

// sets the access token, associating the map with your Mapbox account and its permissions
mapboxgl.accessToken = 'user_access_token';

// creates the map, setting the container to the id of the div you added in step 2, and setting the initial center and zoom level of the map
const myMap = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/abdelrahman-rabea/cmnpt36av000901sa2rz649wu',
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // create popup
  const popup = new mapboxgl.Popup({ offset: 25 }).setText(
    `day ${loc.day}: ${loc.description}`,
  );

  // create a marker
  new mapboxgl.Marker({
    element: document.createElement('div'),
    className: 'marker',
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .setPopup(popup)
    .addTo(myMap);

  // extend the bounds
  bounds.extend(loc.coordinates);
});

// set the bounds to the map
myMap.fitBounds(bounds, {
  padding: { top: 200, bottom: 200, left: 100, right: 100 },
});
