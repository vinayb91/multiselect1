document.addEventListener('DOMContentLoaded', () => {
    const selectContainer = document.getElementById('custom-select');
    const inputContainer = document.getElementById('select-input');
    const searchInput = document.getElementById('search-input');
    const dropdownElement = document.getElementById('select-dropdown');
    const optionsElement = document.getElementById('select-options');

    const options = [];
    for (let i = 10; i < 36; i++) {
        const value = i.toString(36) + i;
        options.push({
            label: value,
            value: value,
        });
    }

    const selectedValues = new Set(['a10', 'c12']);

    const updateInputValue = () => {
        inputContainer.querySelectorAll('.selected-tag').forEach(tag => tag.remove());
        const selectedLabels = options
            .filter(option => selectedValues.has(option.value))
            .map(option => option.label);

        selectedLabels.forEach(label => {
            const tag = document.createElement('span');
            tag.className = 'selected-tag';
            tag.textContent = label;
            tag.addEventListener('click', (event) => {
                event.stopPropagation();
                selectedValues.delete(label);
                updateInputValue();
                renderOptions(searchInput.value);  // Re-render options to reflect selection state
                console.log(`selected ${Array.from(selectedValues).join(', ')}`);
            });
            inputContainer.insertBefore(tag, searchInput);
        });

        searchInput.placeholder = selectedLabels.length ? '' : 'Please select or search...';
    };

    const toggleDropdown = () => {
        const display = dropdownElement.style.display === 'block' ? 'none' : 'block';
        dropdownElement.style.display = display;
        if (display === 'block') {
            searchInput.focus();
            renderOptions();
        }
    };

    const renderOptions = (filter = '') => {
        optionsElement.innerHTML = '';
        options
            .filter(option => option.label.includes(filter))
            .forEach(option => {
                const optionElement = document.createElement('li');
                optionElement.textContent = option.label;
                optionElement.dataset.value = option.value;

                if (selectedValues.has(option.value)) {
                    optionElement.classList.add('selected');
                }

                optionElement.addEventListener('click', () => {
                    if (selectedValues.has(option.value)) {
                        selectedValues.delete(option.value);
                        optionElement.classList.remove('selected');
                    } else {
                        selectedValues.add(option.value);
                        optionElement.classList.add('selected');
                    }
                    updateInputValue();
                    renderOptions(searchInput.value);  // Re-render options to reflect selection state
                    console.log(`selected ${Array.from(selectedValues).join(', ')}`);
                });

                optionsElement.appendChild(optionElement);
            });
    };

    searchInput.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleDropdown();
    });

    searchInput.addEventListener('input', () => {
        renderOptions(searchInput.value);
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && searchInput.value === '') {
            const lastSelected = Array.from(selectedValues).pop();
            if (lastSelected) {
                selectedValues.delete(lastSelected);
                updateInputValue();
                renderOptions();
                console.log(`selected ${Array.from(selectedValues).join(', ')}`);
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (!selectContainer.contains(event.target)) {
            dropdownElement.style.display = 'none';
        }
    });

    updateInputValue();
    renderOptions();
});
