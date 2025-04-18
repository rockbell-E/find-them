document.addEventListener('DOMContentLoaded', () => {
    const filterName     = document.getElementById('filterName');
    const filterPosition = document.getElementById('filterPosition');
    const filterLocation = document.getElementById('filterLocation');
    const workerList     = document.getElementById('workerList');
    const items          = workerList ? workerList.querySelectorAll('.worker-item') : [];
  
    function filterWorkers() {
      const nameTerm = filterName.value.toLowerCase();
      const posTerm  = filterPosition.value.toLowerCase();
      const locTerm  = filterLocation.value.toLowerCase();
  
      items.forEach(item => {
        const name = item.querySelector('.w-name').textContent.toLowerCase();
        const pos  = item.querySelector('.w-position').textContent.toLowerCase();
        const loc  = item.querySelector('.w-location').textContent.toLowerCase();
  
        const matchesName     = name.includes(nameTerm);
        const matchesPosition = posTerm === '' || pos.includes(posTerm);
        const matchesLocation = locTerm === '' || loc.includes(locTerm);
  
        item.style.display = (matchesName && matchesPosition && matchesLocation)
          ? ''
          : 'none';
      });
    }
  
    if (filterName)     filterName.addEventListener('input',  filterWorkers);
    if (filterPosition) filterPosition.addEventListener('change', filterWorkers);
    if (filterLocation) filterLocation.addEventListener('change', filterWorkers);
  });
  