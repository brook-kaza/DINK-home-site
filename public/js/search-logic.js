document.addEventListener('DOMContentLoaded', () => {
    // --- SEARCH & FILTER LOGIC ---
    const grid = document.getElementById('product-grid');
    const cards = Array.from(document.querySelectorAll('.product-card'));
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const countLabel = document.getElementById('item-count');
    const emptyState = document.getElementById('empty-state');

    function updateDisplay() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        // Use 'active-filter' class as the single source of truth for active category
        const activeBtn = document.querySelector('.filter-btn.active-filter');
        const category = activeBtn ? activeBtn.dataset.category : 'all';

        let visibleCount = 0;
        cards.forEach(card => {
            const matchesCat = category === 'all' || card.dataset.category === category;
            const cardName = (card.dataset.name || card.querySelector('h2')?.innerText || '').toLowerCase();
            const matchesSearch = cardName.includes(searchTerm);

            if (matchesCat && matchesSearch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (countLabel) countLabel.innerText = visibleCount;
        if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        if (grid) grid.style.display = visibleCount === 0 ? 'none' : 'grid';

        // Refresh ScrollTrigger if it exists (since heights changed)
        if (window.ScrollTrigger) {
            ScrollTrigger.refresh();
        }
    }

    // Category Filter Click Events
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active-filter', 'text-black');
                b.classList.add('text-zinc-500');
            });
            btn.classList.add('active-filter');
            btn.classList.remove('text-zinc-500');
            updateDisplay();
        });
    });

    // Search Input Event
    if (searchInput) {
        searchInput.addEventListener('input', updateDisplay);
    }

    // --- SORT DROPDOWN ---
    if (sortSelect && grid) {
        // Tag original index to restore 'Latest Arrivals'
        cards.forEach((card, idx) => card.dataset.index = idx);

        sortSelect.addEventListener('change', () => {
            const val = sortSelect.value;

            // 1. Sort the items
            const sorted = [...cards].sort((a, b) => {
                const priceA = parseFloat(a.dataset.price || 0);
                const priceB = parseFloat(b.dataset.price || 0);
                const indexA = parseInt(a.dataset.index);
                const indexB = parseInt(b.dataset.index);

                if (val === 'price-asc') return priceA - priceB;
                if (val === 'price-desc') return priceB - priceA;

                // Default / 'newest': Restore original ordering
                return indexA - indexB;
            });

            // 2. Clear and Re-append (or just append to reorder)
            // Adding a small fade to make the transition feel premium
            gsap.to(grid, {
                opacity: 0,
                y: 10,
                duration: 0.2,
                onComplete: () => {
                    sorted.forEach(card => grid.appendChild(card));
                    gsap.to(grid, {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: "power2.out"
                    });

                    // Refresh ScrollTrigger as the layout has shifted
                    if (window.ScrollTrigger) {
                        ScrollTrigger.refresh();
                    }
                }
            });
        });
    }

});

// Global reset function
function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    const firstBtn = document.querySelector('.filter-btn[data-category="all"]');
    if (searchInput) searchInput.value = '';
    if (firstBtn) firstBtn.click();
}