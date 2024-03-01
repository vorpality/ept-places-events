import { createRoot } from 'react-dom/client';
import FilterComponent from './components/FilterComponent.js';

document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.filter-button');
  const menu = document.querySelector('.filter-menu');

    button.addEventListener( 'click' , event => {
      event.preventDefault()
      menu.classList.add('show-filter');
      const rootElement = document.getElementById('filter-root');
      if (rootElement) {
        const root = createRoot(rootElement);
        root.render(<FilterComponent />);
      }
    })
  
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
})


