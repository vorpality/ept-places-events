import { useState, useEffect, useRef } from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch';

const FilterComponent = ({ postType="post", setFilterMenu }) => {
  const [location, setLocation] = useState('');
  const [type, setType] = useState(postType);
  const [distance, setDistance] = useState('');
  const [date, setDate] = useState('');
  const [showing, setShowing] = useState(false);
  const [order, setOrder] = useState('relevance');
  const menuRef = useRef(null);

  useEffect(() => {
    if (menuRef.current) {
      setFilterMenu(menuRef.current); // Pass menu element to parent JS
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

    // Construct query arguments based on the post type
    const queryArgs = {
      order,
      location,
      type,
      post_type: postType,
    };

    // Add distance filter for "place" post type
    if (postType === 'place') {
      queryArgs.distance = distance;
    }

    // Add date filter for "event" post type
    if (postType === 'event') {
      queryArgs.date = date;
    }

    try {
      const posts = await apiFetch({
        path: "ept/v1/filter-posts", // Your custom endpoint to handle filtering
        method: 'POST',
        data: queryArgs,
      });

      console.log(queryArgs);
      // Handle the filtered posts here
      console.log(posts);
    } catch (error) {
      console.error('Error fetching filtered posts:', error);
    }
  };

  const closeMenu = () => {
    setShowing(false);
    if (menuRef.current) {
      menuRef.current.classList.remove('show-filter'); // Hide the menu
    }
  };

  return (
    <div
      ref={menuRef}
      id = "filter-menu"
      className={`${showing ? 'show-filter' : ''}`}
    >
      <button className="close-filter close-button" onClick={closeMenu}>
        X
      </button>
      <form onSubmit={applyFilters} className="filter-form">


      <div className="wrap-duo">
          <label>Order By</label>
          <select value={type} onChange={(e) => setOrder(e.target.value)} className="filter-item">
            <option value="relevance">Relevance</option>
            <option value="distance">Distance</option>
            <option value="recent">Recent</option>
          </select>
        </div>


      <div className="wrap-duo">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="filter-item">
            <option value="post">Any</option>
            <option value="event">Event</option>
            <option value="place">Place</option>
          </select>
        </div>


      {(type == "place" || type == "post") && 
        <div className="wrap-duo">
           <label>Location</label>
          
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="filter-item"
          />
        </div>
      }
      {(type == "event" || type == "post") && 
          <div className="wrap-duo">
          <label>Date</label>
          
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="filter-item"
          />
        </div>
        }



        {postType === 'place' && (
          <div className="wrap-duo">
            <label>Distance</label>
            <input
              type="text"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="filter-item"
            />
          </div>
        )}

        {postType === 'event' && (
          <div className="wrap-duo">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="filter-item"
            />
          </div>
        )}

        <button className="apply-button" type="submit">Apply filters</button>
      </form>
    </div>

  );
};

export default FilterComponent;