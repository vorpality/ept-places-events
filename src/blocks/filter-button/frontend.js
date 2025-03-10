import { createRoot } from 'react-dom/client';
import FilterComponent from './components/FilterComponent.js';


document.addEventListener('DOMContentLoaded', () => {
  let loaded = false;


  const button = document.querySelector('.filter-button');
  const rootElement = document.getElementById('filter-root');
  const root = createRoot(rootElement);
  let menu;
  let poiField;
  root.render(
    <FilterComponent 
      setFilterMenu={(el) => (menu = el)}
      setPoiField={(el) => (poiField = el)}
    />
  );



  button.addEventListener('click', (event) => {
    event.preventDefault();
    menu.classList.add('show-filter');

    if (!loaded){
      const locationCookie = getCookie('location');
      var lat = 0;
      var lng = 0;
      if (locationCookie=='set') {

        try {
            poiField.setAttribute("lat", parseFloat(getCookie('location.lat')));
            poiField.setAttribute("lng", parseFloat(getCookie('location.lng')));
        } catch (error) {
            varconsole.error("Error parsing location cookie:", error);
        }
      }
      var autocomplete;
      if (poiField != null) {
        var geocoder;
        var script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDY56cwNRUcmVLV3LpSUUwjPWx4TQJHr3I&libraries=places&callback=initMap';
        script.async = true;
        window.initMap = function() {
          
    
          autocomplete = new google.maps.places.Autocomplete(poiField);
          geocoder = new google.maps.Geocoder();
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            console.log(place.geometry.location.lat())
          })
        }
        poiField.addEventListener( 'change', async event => {
          await geocoder.geocode({ address: poiField.value }, function (results, status){
            if (status ==='OK' && results.length > 0){
              poiField.setAttribute("lat", results[0].geometry.location.lat()),
              poiField.setAttribute("lng",  results[0].geometry.location.lng())
            };
          })
      
        })

        poiField.addEventListener('blur', async event => {
          const {AdvancedMarkerElement} = await google.maps.importLibrary("marker")
          const map = new google.maps.Map(document.getElementById('map-canvas'), {
            mapId : 'select-place-map',
            center: { lat: parseFloat(poiField.getAttribute("lat")), lng: parseFloat(poiField.getAttribute("lng")) }, // Default location
            zoom: 12,
          });
        })
        document.head.appendChild(script);
      }
      loaded = true;
    }
  });

 

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


  
/*
  const filter_form = document.querySelector('.filter-form');
  const filters = document.querySelectorAll('.filter-item');
  console.log(filters);
  let filterString = '?filters='
  filter_form?.addEventListener('submit', event =>{
    event.preventDefault();
    filters.forEach( filter => {
      if (filter.value > 0){
        filterString += filter.id +"=" + filter.value+"&";
      }
    })
    filterString = filterString.slice(0,-1);
    const currentUrl = location.protocol + '//' + location.host + location.pathname
    window.location = (currentUrl + filterString);
*/



