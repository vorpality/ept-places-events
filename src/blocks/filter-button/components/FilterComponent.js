import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const FilterComponent = ({ postType = "post" }) => {
  const [location, setLocation] = useState('');
  const [type, setType] = useState(postType);
  const [distance, setDistance] = useState('');
  const [date, setDate] = useState('');
  const [showing, setShowing] = useState(false);
  const [order, setOrder] = useState('relevance');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [geocoder, setGeocoder] = useState(null);

  // Load Google Maps API dynamically and initialize autocomplete
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDY56cwNRUcmVLV3LpSUUwjPWx4TQJHr3I&libraries=places&callback=initMap';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    window.initMap = () => {
      const inputField = document.getElementById('poi');
      const auto = new google.maps.places.Autocomplete(inputField);
      setAutocomplete(auto);
      const geo = new google.maps.Geocoder();
      setGeocoder(geo);

      auto.addListener("place_changed", () => {
        const place = auto.getPlace();
        setLat(place.geometry.location.lat());
        setLng(place.geometry.location.lng());
        setLocation(place.formatted_address);
      });
    };

    loadGoogleMapsScript().catch((error) => {
      console.error("Error loading Google Maps API:", error);
    });

    return () => {
      window.initMap = null;
    };
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Manually excluding google autocomplete clicks 
      const autocompleteDropdownItems = Array.from(document.getElementsByClassName("pac-item"));
  
      // Check if the click is inside the filter menu
      const menuElement = document.getElementById("filter-menu");
  
      // If the click is outside the menu and the autocomplete dropdown, close the menu
      if (
        menuElement && !menuElement.contains(event.target) &&
        !autocompleteDropdownItems.some(item => item.contains(event.target))
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const applyFilters = async (event) => {
    event.preventDefault();

    const queryArgs = {
      order,
      location: { lat, lng },
      type,
      date,
      post_type: postType,
    };

    if (postType === 'place') {
      queryArgs.distance = distance;
    }

    if (postType === 'event') {
      queryArgs.date = date;
    }

    try {
      const posts = await apiFetch({
        path: "ept/v1/filter-posts",
        method: 'POST',
        data: queryArgs,
      });

      console.log("Filter Query:", queryArgs);
      console.log("Filtered Posts:", posts);
    } catch (error) {
      console.error('Error fetching filtered posts:', error);
    }
  };

  const closeMenu = () => {
    setShowing(false);
  };

  return (
    <>
      <button className="filter-button" onClick={() => setShowing(true)}>
        <i className="bi bi-funnel"></i>
      </button>
      <div id="filter-menu" className={`${showing ? 'show-filter' : ''}`}>
        <button className="close-filter close-button" onClick={closeMenu}>X</button>
        <form onSubmit={applyFilters} className="filter-form">

          <div className="wrap-duo">
            <label>Order By</label>
            <select value={order} onChange={(e) => setOrder(e.target.value)} className="filter-item">
              <option value="relevance">Relevance</option>
              <option value="distance">Distance</option>
              <option value="recent">Recent</option>
            </select>
          </div>

          <hr className="spacer" />

          <div className="wrap-duo">
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="filter-item">
              <option value="post">Any</option>
              <option value="event">Event</option>
              <option value="place">Place</option>
            </select>
          </div>

          {(type === "place" || type === "post") && (
            <div className="wrap-duo">
              <label>Location</label>
              <input
                type="text"
                value={location || ""}  // Handle null by using empty string
                onChange={(e) => setLocation(e.target.value)}
                className="filter-item"
                id="poi"
              />
              <input type="hidden" id="poi-lat" />
              <input type="hidden" id="poi-lng" />
            </div>
          )}

          {(type === "event" || type === "post") && (
            <div className="wrap-duo">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="filter-item" />
            </div>
          )}

          {postType === 'place' && (
            <div className="wrap-duo">
              <label>Distance</label>
              <input type="text" value={distance} onChange={(e) => setDistance(e.target.value)} className="filter-item" />
            </div>
          )}

          <button className="apply-button" type="submit">Apply</button>
        </form>
      </div>
    </>
  );
};

export default FilterComponent;
