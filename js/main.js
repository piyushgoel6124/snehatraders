//main.js
document.addEventListener('DOMContentLoaded', () => {
    const productCatalog = document.getElementById('product-catalog'); // Changed from 'catalogue'
    const tagFiltersContainer = document.getElementById('tag-filters');
    const filterToggleButton = document.getElementById('filter-toggle-button');
    const filterOptionsDiv = document.getElementById('filter-options');

    let allItems = [];
    let filteredItems = [];

    // Toggle filter options visibility
    filterToggleButton.addEventListener('click', () => {
        filterOptionsDiv.classList.toggle('hidden'); // Changed from 'active' to 'hidden' to match Tailwind CSS
    });

    // Function to load items from data.json
    async function loadItems() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Flatten the data from categories into a single array of items, adding category property
            allItems = [];
            for (const categoryKey in data) {
                data[categoryKey].forEach(item => {
                    item.category = categoryKey; // Assign the category from the JSON key
                    allItems.push(item);
                });
            }

            filteredItems = [...allItems];
            populateTagFilters(); // Only populate tag filters
            // Removed applyFiltersFromUrl as per user request to not rely on URL params for initial load
            applyFilters(); // Apply filters on initial load
        } catch (error) {
            console.error("Error loading product data:", error);
            document.getElementById('product-catalog').innerHTML = `<p class="text-center text-red-500">Error loading product catalog. Please try again later.</p>`;
        }
    }

    // Populate only tag filters
    function populateTagFilters() {
        const tags = new Set();

        allItems.forEach(item => {
            if (item.tags) {
                item.tags.forEach(tag => tags.add(tag.trim()));
            }
        });

        // Populate Tag Checkboxes
        tagFiltersContainer.innerHTML = '';
        Array.from(tags).sort().forEach(tag => {
            if (tag) {
                const div = document.createElement('div');
                div.classList.add('checkbox-item', 'flex', 'items-center'); // Added flex and items-center for alignment
                div.innerHTML = `
                    <input type="checkbox" id="tag-${tag}" value="${tag}" class="mr-2 rounded border-gray-300 text-primary focus:ring-primary">
                    <label for="tag-${tag}" class="text-gray-700">${tag}</label>
                `;
                tagFiltersContainer.appendChild(div);
            }
        });
    }

    // Render the catalogue
    function renderCatalogue() {
        document.getElementById('product-catalog').innerHTML = ''; // Clear previous content

        // Group items by category for display
        const categorizedItems = {};
        allItems.forEach(item => {
            const category = item.category || 'Uncategorized';
            if (!categorizedItems[category]) {
                categorizedItems[category] = [];
            }
            categorizedItems[category].push(item);
        });

        // Sort categories: categorized first, then 'Uncategorized' last
        const sortedCategories = Object.keys(categorizedItems).sort((a, b) => {
            if (a === 'Uncategorized') return 1;
            if (b === 'Uncategorized') return -1;
            return a.localeCompare(b);
        });

        sortedCategories.forEach(category => {
            const products = categorizedItems[category];
            if (products.length > 0) {
                const displayTitle = category.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                const sectionHtml = createCategorySection(displayTitle, products);
                document.getElementById('product-catalog').insertAdjacentHTML('beforeend', sectionHtml);
            }
        });
    }

    function createCategorySection(title, products) {
        const productCardsHtml = products.map(product => `
            <a href="product.html?sku=${product.skuid}" class="flex-shrink-0 w-48 sm:w-56 product-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                <img src="${product.images[0] || 'https://placehold.co/224x224/e2e8f0/333333?text=Image+Not+Found'}"
                     alt="${product.title}"
                     class="w-full aspect-square object-cover"
                     onerror="this.onerror=null;this.src='https://placehold.co/224x224/e2e8f0/333333?text=Image+Not+Found';">
                <div class="p-4 flex-grow flex items-end pb-2">
                    <h3 class="font-semibold text-md" title="${product.title}">${product.title}</h3>
                </div>
            </a>
        `).join('');

        return `
            <section class="mb-10">
                <h2 class="text-2xl font-bold mb-4 text-primary">${title}</h2>
                <div class="flex flex-wrap gap-4">
                    ${productCardsHtml}
                </div>
            </section>
        `;
    }

    // Apply filters
    function applyFilters() {
        const selectedTags = Array.from(tagFiltersContainer.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

        filteredItems = allItems.filter(item => {
            // Check if the item has all the selected tags
            const matchesTags = selectedTags.length === 0 || (item.tags && selectedTags.every(tag => item.tags.includes(tag)));
            return matchesTags;
        });
        renderCatalogue();
    }

    // Removed applyFiltersFromUrl as per user request to not rely on URL params for initial load
    // If tag filtering from URL is desired, it would need to be re-implemented here.

    // Event listeners for filters
    tagFiltersContainer.addEventListener('change', applyFilters); // Apply filters when any tag checkbox changes

    // Footer dynamic dates
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    document.getElementById('last-updated-date').textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Initial load
    loadItems();
});
