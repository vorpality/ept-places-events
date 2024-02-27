let map;

export async function initMap() {
  const map_element = document.getElementById('place-map');
  if (!map_element) return;
  const lat = map_element.getAttribute("lat");
  const lng = map_element.getAttribute("lng");


  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const map_id = document.getElementById("place-location").value;
  const  latlng = new google.maps.LatLng(lat, lng);
  const map_options = {
    zoom: 15,
    center: latlng,
    mapId : "X"
  }
  map = new Map(map_element, map_options)
  const marker = new AdvancedMarkerElement({
    map: map,
    position: latlng,
  });
}