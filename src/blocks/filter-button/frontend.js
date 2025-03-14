import { createRoot } from 'react-dom/client';
import FilterComponent from './components/FilterComponent.js';

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('filter-root');
  const root = createRoot(rootElement);

  // Read cookies for location
  const locationCookie = getCookie('location');
  let lat = parseFloat(getCookie('location.lat')) || 0;
  let lng = parseFloat(getCookie('location.lng')) || 0;
  let savedLocation = locationCookie === 'set' ? getCookie('location.name') : '';

  // Render React component
  root.render(
    <FilterComponent 
      initialLat={lat}
      initialLng={lng}
      initialLocation={savedLocation}
    />
  );
});

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
      let [key, value] = cookie.split('=');
      if (key === name) {
          return decodeURIComponent(value);
      }
  }
  return null;
}
