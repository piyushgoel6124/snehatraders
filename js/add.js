document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const passwordOverlay = document.getElementById('password-overlay');
    const adminPasswordInput = document.getElementById('admin-password');
    const loginButton = document.getElementById('login-button');
    const loginError = document.getElementById('login-error');
    const adminContent = document.getElementById('admin-content');

    const productTree = document.getElementById('product-tree');
    const addCategoryButton = document.getElementById('add-category-button');

    const productForm = document.getElementById('product-form');
    const productFormContainer = document.getElementById('product-form-container');
    const editingCategoryInput = document.getElementById('editing-category');
    const editingSkuIdInput = document.getElementById('editing-skuid');
    const productTitleInput = document.getElementById('product-title');
    const productSkuIdInput = document.getElementById('product-skuid');
    const productDescriptionTextarea = document.getElementById('product-description');
    const productCategorySelect = document.getElementById('product-category');

    const tagsDisplay = document.getElementById('tags-display');
    const newTagInput = document.getElementById('new-tag');
    const addTagButton = document.getElementById('add-tag-button');

    const keywordsDisplay = document.getElementById('keywords-display');
    const newKeywordInput = document.getElementById('new-keyword');
    const addKeywordButton = document.getElementById('add-keyword-button');

    const imagePreviews = document.getElementById('image-previews');
    const newImageUrlInput = document.getElementById('new-image-url');
    const addImageButton = document.getElementById('add-image-button');

    const variationsContainer = document.getElementById('variations-container');
    const addVariationGroupButton = document.getElementById('add-variation-group-button');

    const saveProductButton = document.getElementById('save-product-button');
    const clearFormButton = document.getElementById('clear-form-button');
    const deleteProductButton = document.getElementById('delete-product-button');

    const downloadJsonButton = document.getElementById('download-json-button');

    // --- State ---
    let allProductsData = {}; // Stores the entire data.json structure
    const ADMIN_PASSWORD = 'admin'; // Simple client-side password

    // --- Password Protection Logic ---
    loginButton.addEventListener('click', () => {
        if (adminPasswordInput.value === ADMIN_PASSWORD) {
            passwordOverlay.classList.add('hidden');
            adminContent.classList.remove('hidden');
            loadProducts();
        } else {
            loginError.classList.remove('hidden');
            setTimeout(() => loginError.classList.add('hidden'), 3000); // Hide error after 3s
        }
    });

    adminPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginButton.click();
        }
    });

    // --- Data Loading and UI Rendering ---
    async function loadProducts() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProductsData = await response.json();
            renderProductTree();
            populateCategoryDropdown();
        } catch (error) {
            console.error("Error loading data.json:", error);
            productTree.innerHTML = `<p class="text-red-500 text-center py-4">Error loading product catalog. Check console for details.</p>`;
        }
    }

    function renderProductTree() {
        productTree.innerHTML = '';
        if (!allProductsData || Object.keys(allProductsData).length === 0) {
            productTree.innerHTML = '<p class="text-gray-500 text-center py-4">No categories found.</p>';
            return;
        }

        for (const categoryKey in allProductsData) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'mb-4';

            const categoryName = categoryKey.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'flex justify-between items-center mb-2 cursor-pointer';
            categoryHeader.innerHTML = `
                <h3 class="font-semibold text-lg text-primary">${categoryName}</h3>
                <div>
                    <button class="edit-category-btn text-blue-500 hover:text-blue-700 mr-2" data-category="${categoryKey}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                    <button class="delete-category-btn text-red-500 hover:text-red-700" data-category="${categoryKey}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            `;
            categoryDiv.appendChild(categoryHeader);

            const productsList = document.createElement('ul');
            productsList.className = 'ml-4 space-y-1';

            if (allProductsData[categoryKey] && allProductsData[categoryKey].length > 0) {
                allProductsData[categoryKey].forEach(product => {
                    const productItem = document.createElement('li');
                    productItem.className = 'product-tree-item p-2 rounded cursor-pointer flex justify-between items-center hover:bg-gray-100';
                    productItem.innerHTML = `
                        <span>${product.title}</span>
                        <div>
                            <button class="edit-product-btn text-blue-500 hover:text-blue-700 mr-2" data-category="${categoryKey}" data-skuid="${product.skuid}">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </button>
                            <button class="delete-product-btn text-red-500 hover:text-red-700" data-category="${categoryKey}" data-skuid="${product.skuid}">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    `;
                    productsList.appendChild(productItem);
                });
            } else {
                const emptyItem = document.createElement('li');
                emptyItem.className = 'text-gray-400 text-sm p-2';
                emptyItem.textContent = 'No products in this category';
                productsList.appendChild(emptyItem);
            }

            categoryDiv.appendChild(productsList);
            productTree.appendChild(categoryDiv);
        }

        // Add event listeners for product tree actions
        document.querySelectorAll('.edit-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                const skuid = e.currentTarget.dataset.skuid;
                loadProductForEditing(category, skuid);
            });
        });

        document.querySelectorAll('.delete-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                const skuid = e.currentTarget.dataset.skuid;
                deleteProduct(category, skuid);
            });
        });

        document.querySelectorAll('.edit-category-btn').forEach(btn => {
           btn.addEventListener('click', (e) => {
                const oldCategoryKey = e.currentTarget.dataset.category;
                const categoryName = prompt("Enter new category name (use underscores for spaces, e.g., 'new_category'):", oldCategoryKey);
                if (categoryName && categoryName.trim() !== "" && categoryName !== oldCategoryKey) {
                    const newCategoryKey = categoryName.trim().toLowerCase().replace(/\s+/g, '_');
                    if (allProductsData[newCategoryKey]) {
                        alert(`Category '${newCategoryKey}' already exists.`);
                        return;
                    }
                    renameCategory(oldCategoryKey, newCategoryKey);
                }
            });
        });

        document.querySelectorAll('.delete-category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const categoryKey = e.currentTarget.dataset.category;
                deleteCategory(categoryKey);
            });
        });
    }

    function populateCategoryDropdown() {
        productCategorySelect.innerHTML = '<option value="">-- Select a Category --</option>';
        for (const categoryKey in allProductsData) {
            const categoryName = categoryKey.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const option = document.createElement('option');
            option.value = categoryKey;
            option.textContent = categoryName;
            productCategorySelect.appendChild(option);
        }
    }

    // --- Product Form Management ---
    function clearForm() {
        productForm.reset();
        editingCategoryInput.value = '';
        editingSkuIdInput.value = '';
        productSkuIdInput.disabled = false; // Re-enable SKU input for new products
        deleteProductButton.classList.add('hidden');

        // Clear dynamic fields
        tagsDisplay.innerHTML = '';
        keywordsDisplay.innerHTML = '';
        imagePreviews.innerHTML = '';
        variationsContainer.innerHTML = '';

        saveProductButton.textContent = 'Save Product';
        deleteProductButton.classList.add('hidden');
    }

    clearFormButton.addEventListener('click', clearForm);

    // --- Tag Management ---
    function addTag(tagText) {
        const tag = tagText.trim();
        if (!tag) return;

        // Check if tag already exists
        const existingTags = Array.from(tagsDisplay.querySelectorAll('.tag-item span')).map(el => el.textContent);
        if (existingTags.includes(tag)) {
            alert(`Tag '${tag}' already added.`);
            return;
        }

        const tagElement = document.createElement('div');
        tagElement.className = 'tag-item';
        tagElement.innerHTML = `
            <span>${tag}</span>
            <span class="remove-tag" title="Remove tag">&times;</span>
        `;
        tagsDisplay.appendChild(tagElement);

        tagElement.querySelector('.remove-tag').addEventListener('click', () => {
            tagElement.remove();
        });

        newTagInput.value = ''; // Clear input
    }

    addTagButton.addEventListener('click', () => addTag(newTagInput.value));
    newTagInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTag(newTagInput.value); });

    // --- Keyword Management ---
    function addKeyword(keywordText) {
        const keyword = keywordText.trim();
        if (!keyword) return;

        // Check if keyword already exists
        const existingKeywords = Array.from(keywordsDisplay.querySelectorAll('.keyword-item span')).map(el => el.textContent);
        if (existingKeywords.includes(keyword)) {
            alert(`Keyword '${keyword}' already added.`);
            return;
        }

        const keywordElement = document.createElement('div');
        keywordElement.className = 'keyword-item';
        keywordElement.innerHTML = `
            <span>${keyword}</span>
            <span class="remove-keyword" title="Remove keyword">&times;</span>
        `;
        keywordsDisplay.appendChild(keywordElement);

        keywordElement.querySelector('.remove-keyword').addEventListener('click', () => {
            keywordElement.remove();
        });

        newKeywordInput.value = ''; // Clear input
    }

    addKeywordButton.addEventListener('click', () => addKeyword(newKeywordInput.value));
    newKeywordInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addKeyword(newKeywordInput.value); });

    // --- Image Management ---
    function addImage(imageUrl) {
        const url = imageUrl.trim();
        if (!url) return;

        // Check if image already exists
        const existingImages = Array.from(imagePreviews.querySelectorAll('img')).map(img => img.src);
        if (existingImages.includes(url)) {
            alert(`Image URL '${url}' already added.`);
            return;
        }

        const imagePreview = document.createElement('div');
        imagePreview.className = 'image-preview';
        imagePreview.innerHTML = `
            <img src="${url}" alt="Product Image Preview" onerror="this.src='https://placehold.co/100x100/e2e8f0/333333?text=Image+Not+Found';">
            <button type="button" class="remove-image" title="Remove image">&times;</button>
        `;
        imagePreviews.appendChild(imagePreview);

        imagePreview.querySelector('.remove-image').addEventListener('click', () => {
            imagePreview.remove();
        });

        newImageUrlInput.value = ''; // Clear input
    }

    addImageButton.addEventListener('click', () => addImage(newImageUrlInput.value));
    newImageUrlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addImage(newImageUrlInput.value); });

    // --- Variation Management ---
    function addVariationGroup(groupName = '') {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'variation-group';

        const groupNameInput = document.createElement('input');
        groupNameInput.type = 'text';
        groupNameInput.placeholder = 'Variation Type (e.g., size, color)';
        groupNameInput.className = 'w-full p-2 border border-gray-300 rounded-md mb-2';
        groupNameInput.value = groupName;

        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'variation-items';

        const addItemButton = document.createElement('button');
        addItemButton.type = 'button';
        addItemButton.className = 'bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded-md text-xs mb-2';
        addItemButton.textContent = 'Add Option';
        addItemButton.addEventListener('click', () => {
            addVariationItem(itemsContainer, '');
        });

        const removeGroupButton = document.createElement('button');
        removeGroupButton.type = 'button';
        removeGroupButton.className = 'remove-variation-group';
        removeGroupButton.textContent = 'Remove Variation Type';
        removeGroupButton.addEventListener('click', () => {
            groupDiv.remove();
        });

        groupDiv.appendChild(groupNameInput);
        groupDiv.appendChild(itemsContainer);
        groupDiv.appendChild(addItemButton);
        groupDiv.appendChild(removeGroupButton);

        variationsContainer.appendChild(groupDiv);
        return { groupDiv, groupNameInput, itemsContainer };
    }

    function addVariationItem(container, itemValue = '') {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'variation-item';

        const itemInput = document.createElement('input');
        itemInput.type = 'text';
        itemInput.placeholder = 'Option (e.g., S, M, Red, Blue)';
        itemInput.className = 'p-1 border border-gray-300 rounded-md';
        itemInput.value = itemValue;

        const removeItemButton = document.createElement('button');
        removeItemButton.type = 'button';
        removeItemButton.className = 'remove-variation-item';
        removeItemButton.textContent = 'Remove';
        removeItemButton.addEventListener('click', () => {
            itemDiv.remove();
        });

        itemDiv.appendChild(itemInput);
        itemDiv.appendChild(removeItemButton);
        container.appendChild(itemDiv);
    }

    addVariationGroupButton.addEventListener('click', () => addVariationGroup());

    // --- Product Loading for Editing ---
    function loadProductForEditing(categoryKey, skuid) {
        const product = allProductsData[categoryKey]?.find(p => p.skuid === skuid);
        if (!product) {
            alert("Product not found.");
            return;
        }

        clearForm(); // Clear form before loading

        // Fill form fields
        editingCategoryInput.value = categoryKey;
        editingSkuIdInput.value = product.skuid;
        productSkuIdInput.value = product.skuid;
        productSkuIdInput.disabled = true; // Disable SKU editing
        productTitleInput.value = product.title || '';
        productDescriptionTextarea.value = product.desc || '';
        productCategorySelect.value = categoryKey;

        // Load tags
        if (product.tags && Array.isArray(product.tags)) {
            product.tags.forEach(tag => {
                if (tag && tag.trim()) addTag(tag.trim());
            });
        }

        // Load keywords
        if (product.keywords && Array.isArray(product.keywords)) {
            product.keywords.forEach(keyword => {
                if (keyword && keyword.trim()) addKeyword(keyword.trim());
            });
        }

        // Load images
        if (product.images && Array.isArray(product.images)) {
            product.images.forEach(img => {
                if (img && img.trim()) addImage(img.trim());
            });
        }

        // Load variations
        if (product.variations && typeof product.variations === 'object') {
            for (const varType in product.variations) {
                if (Array.isArray(product.variations[varType])) {
                    const { itemsContainer } = addVariationGroup(varType);
                    product.variations[varType].forEach(option => {
                        addVariationItem(itemsContainer, option);
                    });
                }
            }
        }

        saveProductButton.textContent = 'Update Product';
        deleteProductButton.classList.remove('hidden');
        deleteProductButton.dataset.category = categoryKey;
        deleteProductButton.dataset.skuid = skuid;

        // Scroll to form
        productFormContainer.scrollIntoView({ behavior: 'smooth' });
    }


    // --- Product Saving/Updating ---
    productForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Collect form data
        const skuid = productSkuIdInput.value.trim();
        const title = productTitleInput.value.trim();
        const description = productDescriptionTextarea.value.trim();
        const category = productCategorySelect.value.trim();

        if (!skuid || !title || !description || !category) {
            alert("Please fill in all required fields marked with *.");
            return;
        }

        // Collect tags
        const tags = Array.from(tagsDisplay.querySelectorAll('.tag-item span')).map(span => span.textContent);

        // Collect keywords
        const keywords = Array.from(keywordsDisplay.querySelectorAll('.keyword-item span')).map(span => span.textContent);

        // Collect images
        const images = Array.from(imagePreviews.querySelectorAll('img')).map(img => img.src);
        if (images.length === 0) {
             alert("Please add at least one image.");
             return;
        }

        // Collect variations
        const variations = {};
        const variationGroups = variationsContainer.querySelectorAll('.variation-group');
        variationGroups.forEach(group => {
            const groupNameInput = group.querySelector('input[type="text"]');
            const groupName = groupNameInput.value.trim();
            if (groupName) {
                const itemInputs = group.querySelectorAll('.variation-item input[type="text"]');
                const options = Array.from(itemInputs).map(input => input.value.trim()).filter(val => val !== '');
                if (options.length > 0) {
                    variations[groupName] = options;
                }
            }
        });

        const newProductData = {
            skuid,
            title,
            desc: description,
            images,
            tags,
            keywords,
            variations
        };

        const isEditing = editingSkuIdInput.value !== ''; // Check if we are editing
        const originalCategory = editingCategoryInput.value;
        const originalSkuId = editingSkuIdInput.value;

        if (isEditing) {
            // --- Update Existing Product ---
            let productFound = false;
            let productIndex = -1;

            // Find the product in its original category
            if (allProductsData[originalCategory]) {
                productIndex = allProductsData[originalCategory].findIndex(p => p.skuid === originalSkuId);
                if (productIndex !== -1) {
                    productFound = true;
                    // If category changed, move product
                    if (originalCategory !== category) {
                        // Remove from old category
                        allProductsData[originalCategory].splice(productIndex, 1);
                        // Add to new category
                        if (!allProductsData[category]) allProductsData[category] = [];
                        allProductsData[category].push(newProductData);
                    } else {
                        // Update in same category
                        allProductsData[originalCategory][productIndex] = newProductData;
                    }
                }
            }

            if (productFound) {
                 // Re-sort the affected categories
                 if (allProductsData[category]) {
                     allProductsData[category].sort((a, b) => a.title.localeCompare(b.title));
                 }
                 if (category !== originalCategory && allProductsData[originalCategory]) {
                     allProductsData[originalCategory].sort((a, b) => a.title.localeCompare(b.title));
                 }
                 alert('Product updated successfully!');
            } else {
                alert('Error: Product to update not found.');
                return;
            }

        } else {
            // --- Add New Product ---
            // Check for duplicate SKU across all categories
            let skuExists = false;
            for (const catKey in allProductsData) {
                if (allProductsData[catKey].some(p => p.skuid === skuid)) {
                    skuExists = true;
                    break;
                }
            }
            if (skuExists) {
                alert(`Error: A product with SKU ID '${skuid}' already exists.`);
                return;
            }

            if (!allProductsData[category]) {
                allProductsData[category] = [];
            }
            allProductsData[category].push(newProductData);
            // Re-sort the category
            allProductsData[category].sort((a, b) => a.title.localeCompare(b.title));
            alert('Product added successfully!');
        }

        // Refresh UI
        renderProductTree();
        populateCategoryDropdown();
        clearForm();
    });

    // --- Product Deletion ---
    function deleteProduct(categoryKey, skuid) {
         if (!confirm(`Are you sure you want to delete the product with SKU ID: ${skuid}?`)) {
             return;
         }

         const category = allProductsData[categoryKey];
         if (category) {
             const initialLength = category.length;
             allProductsData[categoryKey] = category.filter(p => p.skuid !== skuid);
             if (allProductsData[categoryKey].length < initialLength) {
                 alert('Product deleted successfully!');
                 renderProductTree();
                 populateCategoryDropdown();
                 // Clear form if it was the deleted product
                 if (editingSkuIdInput.value === skuid) {
                     clearForm();
                 }
                 return;
             }
         }
         alert('Product not found.');
    }

    deleteProductButton.addEventListener('click', () => {
         const category = deleteProductButton.dataset.category;
         const skuid = deleteProductButton.dataset.skuid;
         if (category && skuid) {
              deleteProduct(category, skuid);
         }
    });

    // --- Category Management ---
    addCategoryButton.addEventListener('click', () => {
        const categoryName = prompt("Enter new category name (use underscores for spaces, e.g., 'new_category'):");
        if (categoryName && categoryName.trim() !== "") {
            const categoryKey = categoryName.trim().toLowerCase().replace(/\s+/g, '_');
            if (allProductsData[categoryKey]) {
                alert(`Category '${categoryKey}' already exists.`);
                return;
            }
            allProductsData[categoryKey] = [];
            renderProductTree();
            populateCategoryDropdown();
            alert(`Category '${categoryName}' added successfully!`);
        }
    });

    function renameCategory(oldKey, newKey) {
        if (allProductsData[oldKey]) {
            allProductsData[newKey] = allProductsData[oldKey];
            delete allProductsData[oldKey];

            // Update form if editing a product from the renamed category
            if (editingCategoryInput.value === oldKey) {
                editingCategoryInput.value = newKey;
                productCategorySelect.value = newKey;
            }

            renderProductTree();
            populateCategoryDropdown();
            alert(`Category renamed from '${oldKey}' to '${newKey}'.`);
        }
    }

    function deleteCategory(categoryKey) {
        const category = allProductsData[categoryKey];
        if (!category) {
             alert('Category not found.');
             return;
        }

        if (category.length > 0) {
             if (!confirm(`Category '${categoryKey}' contains ${category.length} product(s). Are you sure you want to delete the entire category and all its products?`)) {
                 return;
             }
        } else {
             if (!confirm(`Are you sure you want to delete the empty category '${categoryKey}'?`)) {
                 return;
             }
        }

        delete allProductsData[categoryKey];
        renderProductTree();
        populateCategoryDropdown();
        // Clear form if editing a product from the deleted category
        if (editingCategoryInput.value === categoryKey) {
            clearForm();
        }
        alert(`Category '${categoryKey}' deleted.`);
    }


    // --- Download JSON Logic ---
    downloadJsonButton.addEventListener('click', () => {
        const jsonString = JSON.stringify(allProductsData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up
        alert('data.json downloaded successfully!');
    });

    // --- Footer Dates ---
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    document.getElementById('last-updated-date').textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});