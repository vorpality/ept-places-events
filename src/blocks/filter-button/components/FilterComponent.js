import {useState} from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch';

const FilterComponent = ({ postType }) => {
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [distance, setDistance] = useState('');
  const [date, setDate] = useState('');

  const applyFilters = async (event) => {
    event.preventDefault();

    // Construct query arguments based on the post type
    const queryArgs = {
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
        path: '/wp-json/ept/v1/filter-posts', // Your custom endpoint to handle filtering
        method: 'POST',
        data: queryArgs,
      });

      // Handle the filtered posts here
      console.log(posts);
    } catch (error) {
      console.error('Error fetching filtered posts:', error);
    }
  };

  return (
    <div className="filter-menu">
      <form onSubmit={applyFilters} className="filter-form">
        <div className="wrap-duo">
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="filter-item"
          />
        </div>

        <div className="wrap-duo">
          <label>Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="filter-item"
          >
            <option value="">Select Type</option>
            {/* Populate options based on post type */}
          </select>
        </div>

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

        <button type="submit">Apply filters</button>
      </form>
    </div>
  );
};

export default FilterComponent;