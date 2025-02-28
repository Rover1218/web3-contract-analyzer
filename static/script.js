document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('scanForm');
    const clearBtn = document.getElementById('clearBtn');
    const textarea = document.querySelector('textarea[name="contract_code"]');
    const button = document.getElementById('scanButton');
    const buttonText = button.querySelector('.button-text');
    const spinner = button.querySelector('.loading-spinner');

    // Clear button functionality
    clearBtn?.addEventListener('click', () => {
        textarea.value = '';
        const resultsContainer = document.querySelector('.results-container');
        if (resultsContainer) {
            resultsContainer.remove();
        }
        const errorAlert = document.querySelector('.alert-danger');
        if (errorAlert) {
            errorAlert.remove();
        }
    });

    form?.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!textarea.value.trim()) {
            alert('Please enter some Solidity code first!');
            return;
        }

        // Show loading state
        buttonText.style.display = 'none';
        spinner.style.display = 'inline-block';
        button.disabled = true;

        try {
            const formData = new FormData(form);
            const response = await fetch('/', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Update only the necessary parts
            const newResults = doc.querySelector('.results-container');
            const newError = doc.querySelector('.alert-danger');
            const currentResults = document.querySelector('.results-container');
            const currentError = document.querySelector('.alert-danger');

            if (currentResults) currentResults.remove();
            if (currentError) currentError.remove();
            if (newResults) form.parentElement.appendChild(newResults);
            if (newError) form.parentElement.appendChild(newError);

        } catch (error) {
            const errorHtml = `
                <div class="alert alert-danger mt-4" role="alert">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Error: ${error.message}</span>
                </div>
            `;
            form.insertAdjacentHTML('afterend', errorHtml);
        } finally {
            // Restore button state
            buttonText.style.display = 'inline-block';
            spinner.style.display = 'none';
            button.disabled = false;
        }
    });
});
