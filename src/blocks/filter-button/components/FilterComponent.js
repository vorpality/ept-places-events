import { useState, useEffect, useRef } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const FilterComponent = ({ postType = "post", setFilterMenu, setPoiField }) => {
  const [location, setLocation] = useState('');
  const [type, setType] = useState(postType);
  const [distance, setDistance] = useState('');
  const [date, setDate] = useState('');
  const [showing, setShowing] = useState(false);
  const [order, setOrder] = useState('relevance');
  const menuRef = useRef(null);
  const poiRef = useRef(null);

  useEffect(() => {
    if (menuRef.current) {
      setFilterMenu(menuRef.current); // Pass menu element to parent JS
    }
    if (poiRef.current) {
      setPoiField(poiRef.current); // Pass POI field up to parent
    }
  }, []); // Runs only once after mount

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
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
      location,
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
    if (menuRef.current) {
      menuRef.current.classList.remove('show-filter');
    }
  };

  return (
    <div ref={menuRef} id="filter-menu" className={`${showing ? 'show-filter' : ''}`}>
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
            <input type="text" ref={poiRef} value={location} onChange={(e) => setLocation(e.target.value)} className="filter-item" id="poi" />
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

        <button className="apply-button" type="submit">Apply filters</button>

        <div id="map-canvas"></div>
      </form>
    </div>
  );
};

export default FilterComponent;
