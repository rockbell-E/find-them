document.addEventListener('DOMContentLoaded', () => {
    const filterInput = document.getElementById('filterCompanyName');
    const list = document.getElementById('companyList');
    const items = list ? list.querySelectorAll('.company-item') : [];
  
    function filterCompanies() {
      const term = filterInput.value.toLowerCase();
      items.forEach(item => {
        const name = item.querySelector('.c-name').textContent.toLowerCase();
        item.style.display = name.includes(term) ? '' : 'none';
      });
    }
  
    if (filterInput) {
      filterInput.addEventListener('input', filterCompanies);
    }
  });
  