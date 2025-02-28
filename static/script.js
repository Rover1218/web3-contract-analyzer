document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const form = document.getElementById('scanForm');
    const clearBtn = document.getElementById('clearBtn');
    const textarea = document.querySelector('textarea[name="contract_code"]');
    const button = document.getElementById('scanButton');
    const buttonText = button.querySelector('.button-text');
    const spinner = button.querySelector('.loading-spinner');

    // Initialize animations for page elements
    initializeAnimations();

    // Add floating animation to background cubes
    animateBackgroundElements();

    // Apply syntax highlighting for Solidity
    applySolidityHighlighting();

    // Clear button functionality with animation
    clearBtn?.addEventListener('click', () => {
        // Fade out results before removing
        const resultsContainer = document.querySelector('.results-container');
        const errorAlert = document.querySelector('.alert-danger');

        if (resultsContainer) {
            fadeOutAndRemove(resultsContainer);
        }

        if (errorAlert) {
            fadeOutAndRemove(errorAlert);
        }

        // Clear textarea with animation
        if (textarea.value) {
            textarea.style.transition = 'all 0.3s ease';
            textarea.style.opacity = '0.5';

            setTimeout(() => {
                textarea.value = '';
                textarea.style.opacity = '1';
            }, 300);
        }
    });

    // Form submission with enhanced animations
    form?.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!textarea.value.trim()) {
            showErrorMessage('Please enter some Solidity code first!');
            shakeElement(textarea);
            return;
        }

        // Show loading state with animation
        button.classList.add('loading');
        buttonText.style.display = 'none';
        spinner.style.display = 'inline-block';
        button.disabled = true;

        // Add subtle animation to form while processing
        form.parentElement.style.opacity = '0.8';
        form.parentElement.style.transform = 'scale(0.99)';
        form.parentElement.style.transition = 'all 0.3s ease';

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

            // Update only the necessary parts with smooth transitions
            const newResults = doc.querySelector('.results-container');
            const newError = doc.querySelector('.alert-danger');
            const currentResults = document.querySelector('.results-container');
            const currentError = document.querySelector('.alert-danger');

            // Remove existing content with fade out animation
            if (currentResults) fadeOutAndRemove(currentResults);
            if (currentError) fadeOutAndRemove(currentError);

            // Add new content with fade in animation
            if (newResults) {
                newResults.style.opacity = '0';
                newResults.style.transform = 'translateY(20px)';
                form.parentElement.appendChild(newResults);

                setTimeout(() => {
                    newResults.style.transition = 'all 0.5s ease';
                    newResults.style.opacity = '1';
                    newResults.style.transform = 'translateY(0)';

                    // Stagger animations for children elements
                    const statsPanel = newResults.querySelector('.stats-panel');
                    const findingsList = newResults.querySelector('.findings-list');

                    if (statsPanel) {
                        animateChildrenSequentially(statsPanel, 'fadeInUp', 100);
                    }

                    if (findingsList) {
                        animateChildrenSequentially(findingsList, 'fadeInUp', 150);
                    }
                }, 10);

                // After updating content, apply syntax highlighting to new code blocks
                setTimeout(() => {
                    applySolidityHighlighting();
                }, 100);
            }

            if (newError) {
                newError.style.opacity = '0';
                newError.style.transform = 'translateY(20px)';
                form.parentElement.appendChild(newError);

                setTimeout(() => {
                    newError.style.transition = 'all 0.5s ease';
                    newError.style.opacity = '1';
                    newError.style.transform = 'translateY(0)';
                }, 10);
            }

        } catch (error) {
            showErrorMessage(`Error: ${error.message}`);
        } finally {
            // Restore button and form state with animation
            setTimeout(() => {
                buttonText.style.display = 'inline-block';
                spinner.style.display = 'none';
                button.disabled = false;
                button.classList.remove('loading');

                form.parentElement.style.opacity = '1';
                form.parentElement.style.transform = 'scale(1)';
            }, 500);
        }
    });

    // Add scroll animation for better UX - Updated
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY;
        const navbar = document.querySelector('.glass-nav');

        if (scrollPosition > 30) {
            navbar.style.padding = '0.35rem 0';
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.padding = '0.5rem 0';
            navbar.style.background = 'rgba(15, 23, 42, 0.85)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Helper functions for animations
    function initializeAnimations() {
        // Add initial animation to elements
        const header = document.querySelector('.navbar-brand');
        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(-20px)';

            setTimeout(() => {
                header.style.transition = 'all 0.5s ease';
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, 100);
        }

        const container = document.querySelector('.glass-container');
        if (container) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';

            setTimeout(() => {
                container.style.transition = 'all 0.5s ease';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 300);
        }
    }

    function animateBackgroundElements() {
        const cubes = document.querySelectorAll('.cube');
        cubes.forEach((cube, index) => {
            // Add random initial positions
            cube.style.transform = `translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random() * 0.4})`;
        });
    }

    function fadeOutAndRemove(element) {
        element.style.transition = 'all 0.3s ease';
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';

        setTimeout(() => {
            element.remove();
        }, 300);
    }

    function showErrorMessage(message) {
        const existingError = document.querySelector('.alert-danger');
        if (existingError) {
            existingError.remove();
        }

        const errorHtml = `
            <div class="alert alert-danger mt-4" role="alert">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;

        const errorElement = document.createElement('div');
        errorElement.innerHTML = errorHtml;
        const errorNode = errorElement.firstChild;

        errorNode.style.opacity = '0';
        errorNode.style.transform = 'translateY(20px)';

        form.parentElement.appendChild(errorNode);

        setTimeout(() => {
            errorNode.style.transition = 'all 0.5s ease';
            errorNode.style.opacity = '1';
            errorNode.style.transform = 'translateY(0)';
        }, 10);
    }

    function shakeElement(element) {
        element.classList.add('shake-animation');
        setTimeout(() => {
            element.classList.remove('shake-animation');
        }, 600);
    }

    function animateChildrenSequentially(parent, animationClass, delay) {
        const children = parent.children;
        Array.from(children).forEach((child, index) => {
            setTimeout(() => {
                child.classList.add(animationClass);
            }, index * delay);
        });
    }

    // Function to apply syntax highlighting to Solidity code - Updated for better visibility
    function applySolidityHighlighting() {
        document.querySelectorAll('.code-block pre code').forEach(codeBlock => {
            const solidityCode = codeBlock.textContent;

            // Skip if already highlighted or empty
            if (!solidityCode || codeBlock.classList.contains('highlighted')) return;

            // Define Solidity keywords, types, and patterns
            const keywords = [
                'pragma', 'solidity', 'contract', 'function', 'public', 'private',
                'internal', 'external', 'view', 'pure', 'payable', 'returns', 'return',
                'if', 'else', 'for', 'while', 'do', 'break', 'continue', 'throw', 'emit',
                'require', 'assert', 'revert', 'using', 'struct', 'enum', 'mapping',
                'memory', 'storage', 'calldata', 'modifier', 'event', 'indexed',
                'import', 'interface', 'library', 'is', 'override', 'virtual',
                'constructor', 'delete', 'new', 'try', 'catch', 'as', 'constant',
                'immutable', 'unchecked', 'receive', 'fallback'
            ];

            const types = [
                'address', 'bool', 'string', 'bytes', 'bytes32', 'bytes4', 'uint', 'int',
                'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256',
                'int8', 'int16', 'int32', 'int64', 'int128', 'int256'
            ];

            let highlightedCode = solidityCode;

            // Highlight comments
            highlightedCode = highlightedCode.replace(/(\/\/.*$)/gm, '<span class="solidity-comment">$1</span>');
            highlightedCode = highlightedCode.replace(/(\/\*[\s\S]*?\*\/)/gm, '<span class="solidity-comment">$1</span>');

            // Highlight strings
            highlightedCode = highlightedCode.replace(/(".*?"|'.*?')/g, '<span class="solidity-string">$1</span>');

            // Highlight numbers
            highlightedCode = highlightedCode.replace(/(\b\d+(\.\d+)?\b)/g, '<span class="solidity-number">$1</span>');

            // Highlight keywords
            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'g');
                highlightedCode = highlightedCode.replace(regex, `<span class="solidity-keyword">${keyword}</span>`);
            });

            // Highlight types
            types.forEach(type => {
                const regex = new RegExp(`\\b${type}\\b`, 'g');
                highlightedCode = highlightedCode.replace(regex, `<span class="solidity-type">${type}</span>`);
            });

            // Highlight function calls
            highlightedCode = highlightedCode.replace(/\b(\w+)\s*\(/g, '<span class="solidity-function">$1</span>(');

            // Wrap any non-highlighted text to ensure it's white
            highlightedCode = `<span class="code-text">${highlightedCode}</span>`;

            // Set the highlighted code
            codeBlock.innerHTML = highlightedCode;
            codeBlock.classList.add('highlighted');
        });
    }

    // Call syntax highlighting on page load
    applySolidityHighlighting();

    // Add animation styles
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake-animation {
            animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translate3d(0, 30px, 0);
            }
            to {
                opacity: 1;
                transform: translate3d(0, 0, 0);
            }
        }
        
        .fadeInUp {
            animation: fadeInUp 0.5s ease forwards;
        }
    `;
    document.head.appendChild(style);

    // Add these styles for code visibility
    const additionalStyles = document.createElement('style');
    additionalStyles.innerHTML = `
        .code-text {
            color: #f8f9fa !important;
        }
        
        .language-solidity {
            color: #f8f9fa !important;
        }
        
        pre, code {
            color: #f8f9fa !important;
        }
    `;
    document.head.appendChild(additionalStyles);
});
