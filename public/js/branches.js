document.addEventListener('DOMContentLoaded', () => {
    const filterInput = document.getElementById('filterBranchName');
    const branchList   = document.getElementById('branchList');
    const items        = branchList ? branchList.querySelectorAll('.branch-item') : [];
  
    function filterBranches() {
      const term = filterInput.value.toLowerCase();
      items.forEach(item => {
        const name = item.querySelector('.b-name').textContent.toLowerCase();
        item.style.display = name.includes(term) ? '' : 'none';
      });
    }
  
    if (filterInput) {
      filterInput.addEventListener('input', filterBranches);
    }
  });
  