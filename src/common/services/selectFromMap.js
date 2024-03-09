
 
export const mapSelect = (props) => {
  const startingPosition = !isNaN(props.startingPosition) ? props.startingPosition : {lat:37.98, lng:23.725}
  const mainFields = {
    lat : props.mainFields.lat,
    lng : props.mainFields.lng,
    input : props.mainFields.input
  };

  const tempFields = {
    lat : props.tempFields.lat,
    lng : props.tempFields.lng
  };


  const modal = {
    openButton : props.modal.openButton,
    content : props.modal.content,
    close : props.modal.closeButton,
    confirm : props.modal.confirmButton
  }

  const closeModal = () => {
    modal.content.style.display = 'none';
    document.body.classList.remove('no-scroll');
  };

  modal.openButton.addEventListener('click', () => {

    modal.content.style.display = 'block';
    document.body.classList.add('no-scroll'); 
    initMapPopup(tempFields, startingPosition, !!props.startingPosition); 
  });
  
  modal.confirm.addEventListener('click', async () => {
    mainFields.lat.value = parseFloat(tempFields.lat.value);
    mainFields.lng.value = parseFloat(tempFields.lng.value);

    const latLng = {
      lat : parseFloat(tempFields.lat.value),
      lng : parseFloat(tempFields.lng.value)
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        mainFields.input.value = results[0].formatted_address;
      }
    });
  
    closeModal();
  });

  modal.close.forEach( (closeEl) => {
    closeEl.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
}

async function initMapPopup(fields, defaultPos, hasSelection) {
  const {AdvancedMarkerElement} = await google.maps.importLibrary("marker")
  const map = new google.maps.Map(document.getElementById('map-canvas'), {
    mapId : 'select-place-map',
    center: { lat: defaultPos.lat, lng: defaultPos.lng }, // Default location
    zoom: 12,
  });
  let markers = [];
  if (hasSelection){
    markers.push(new AdvancedMarkerElement ({
      position: { lat: defaultPos.lat, lng: defaultPos.lng },
      map: map,
      draggable: true,
    }));
  }

  
  map.addListener("click", (mapsMouseEvent) => {
    const latlng = mapsMouseEvent.latLng.toJSON();
    if (markers[0]){
      markers[0].position = null;
    }
    markers = [];
    markers.push(new AdvancedMarkerElement ({
      position: { lat: latlng.lat, lng: latlng.lng },
      map: map,
      draggable: true,
    }));
    fields.lat.value = latlng.lat;
    fields.lng.value = latlng.lng;
  })

}