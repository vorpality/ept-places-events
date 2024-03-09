import { useState, useEffect, useRef } from 'react';
import { __ } from '@wordpress/i18n';

export const SortDropdown = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mapping to store display values
  const displayValues = {
    'featured': __('Featured', 'e-potis'),
    'distance': __('Distance', 'e-potis'),
    // ... add other sort options here
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderby = params.get('orderby') || 'featured';
    setSelectedValue(orderby);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (value) => {
    setSelectedValue(value);
    setIsOpen(false);

    // Update the URL query parameter and refresh the page
    const currentUrl = new URL(window.location);
    const params = currentUrl.searchParams;

    if (value === 'featured') {
      params.delete('orderby');
    } else {
      params.set('orderby', value);
    }

    window.location.href = currentUrl.toString();
  };

  return (
    <div ref={dropdownRef} className="custom-dropdown">
      <div className="custom-dropdown-selection" onClick={handleToggleDropdown}>
        {`Sort by: ${displayValues[selectedValue]} `}
        <i className={`bi bi-caret-${isOpen ? 'up' : 'down'}-fill dropdown-arrow`}></i>
      </div>
      {isOpen && (
        <div className="custom-dropdown-options">
          {/* Render the selected option as the first item */}
          <div
            key={selectedValue}
            onClick={() => handleSelectOption(selectedValue)}
            className="custom-dropdown-option selected"
          >
            {displayValues[selectedValue]}
          </div>
          {/* Render the rest of the options */}
          {Object.entries(displayValues).map(([key, displayValue]) => {
            if (key !== selectedValue) {
              return (
                <div
                  key={key}
                  onClick={() => handleSelectOption(key)}
                  className="custom-dropdown-option"
                >
                  {displayValue}
                </div>
              );
            }
            return null; // Exclude the selected option from the rest of the list
          })}
        </div>
      )}
    </div>
  );
};
