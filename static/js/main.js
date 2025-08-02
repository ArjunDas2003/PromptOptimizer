// Global variables
let chatHistory = [];
let isLoading = false;

// DOM elements
const prompt1 = document.getElementById('prompt1');
const send1 = document.getElementById('send1');
const clear1 = document.getElementById('clear1');
const historyBox = document.getElementById('history-box');

const prompt2 = document.getElementById('prompt2');
const send2 = document.getElementById('send2');
const codeOutput = document.getElementById('code-output');
const preview = document.getElementById('preview');

const prompt3 = document.getElementById('prompt3');
const send3 = document.getElementById('send3');
const optimisedPrompt = document.querySelector('.optimised-prompt');

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Option 1 event listeners
    send1.addEventListener('click', handleChatSubmit);
    clear1.addEventListener('click', handleClearHistory);
    prompt1.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleChatSubmit();
        }
    });

    // Option 2 event listeners
    send2.addEventListener('click', handleCodeGeneration);
    prompt2.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleCodeGeneration();
        }
    });

    // Option 3 event listeners
    send3.addEventListener('click', handlePromptOptimization);
    prompt3.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handlePromptOptimization();
        }
    });

    // Load saved history from localStorage
    loadHistoryFromStorage();
});

// Option 1: Chat functionality
async function handleChatSubmit() {
    const prompt = prompt1.value.trim();
    
    if (!prompt) {
        alert('Please enter a prompt');
        return;
    }

    if (isLoading) return;

    try {
        setLoadingState(send1, true);
        
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                history: chatHistory,
                timestamp: new Date().toLocaleTimeString()
            })
        });

        const data = await response.json();

        if (data.success) {
            chatHistory = data.history;
            updateHistoryDisplay();
            saveHistoryToStorage();
            prompt1.value = ''; // Clear input
        } else {
            throw new Error(data.error || 'Unknown error occurred');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    } finally {
        setLoadingState(send1, false);
    }
}

function handleClearHistory() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        chatHistory = [];
        updateHistoryDisplay();
        clearHistoryFromStorage();
    }
}

function updateHistoryDisplay() {
    if (chatHistory.length === 0) {
        historyBox.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-style: italic;">History will appear here...</p>';
        return;
    }

    let historyHTML = '';
    chatHistory.forEach((item, index) => {
        if (item.type === 'user') {
            historyHTML += `
                <div class="message user-message">
                    <div class="message-header">
                        <strong>You</strong>
                        <span class="timestamp">${item.timestamp}</span>
                    </div>
                    <div class="message-content">${escapeHtml(item.content)}</div>
                </div>
            `;
        } else if (item.type === 'ai') {
            historyHTML += `
                <div class="message ai-message">
                    <div class="message-header">
                        <strong>AI Assistant</strong>
                    </div>
                    <div class="message-content">${formatAIResponse(item.content)}</div>
                </div>
            `;
        }
    });

    historyBox.innerHTML = historyHTML;
    historyBox.scrollTop = historyBox.scrollHeight; // Auto-scroll to bottom
}

// Option 2: Code generation functionality
async function handleCodeGeneration() {
    const prompt = prompt2.value.trim();
    
    if (!prompt) {
        alert('Please enter a prompt for code generation');
        return;
    }

    if (isLoading) return;

    try {
        setLoadingState(send2, true);
        codeOutput.textContent = 'Generating code...';
        
        const response = await fetch('/generate-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        const data = await response.json();

        if (data.success) {
            displayGeneratedCode(data.code);
            updatePreview(data.code);
        } else {
            throw new Error(data.error || 'Unknown error occurred');
        }

    } catch (error) {
        console.error('Error:', error);
        codeOutput.textContent = 'Error: ' + error.message;
        alert('Error: ' + error.message);
    } finally {
        setLoadingState(send2, false);
    }
}

async function handlePromptOptimization() {
    const prompt = prompt3.value.trim();

    if (!prompt) {
        alert('Please enter a prompt to optimize');
        return;
    }

    if (isLoading) return;

    try {
        setLoadingState(send3, true);
        optimisedPrompt.textContent = 'Optimizing prompt...';

        const response = await fetch('/optimize-prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        const data = await response.json();

        if (data.success) {
            optimisedPrompt.textContent = data.optimized_prompt;
            addCopyButton(optimisedPrompt, data.optimized_prompt);
        } else {
            throw new Error(data.error || 'Unknown error occurred');
        }

    } catch (error) {
        console.error('Error:', error);
        optimisedPrompt.textContent = 'Error: ' + error.message;
        alert('Error: ' + error.message);
    } finally {
        setLoadingState(send3, false);
    }
}

function displayGeneratedCode(code) {
    codeOutput.textContent = code;
    addCopyButton(codeOutput, code);
}

function addCopyButton(element, textToCopy) {
    // Add copy button functionality
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.className = 'copy-btn';
    copyButton.onclick = () => copyToClipboard(textToCopy);
    
    // Clear any existing copy button
    const existingBtn = element.parentNode.querySelector('.copy-btn');
    if (existingBtn) existingBtn.remove();
    
    element.parentNode.insertBefore(copyButton, element.nextSibling);
}


function updatePreview(code) {
    // Create blob URL for the HTML content
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Update iframe source
    preview.src = url;
    
    // Clean up previous blob URLs to prevent memory leaks
    preview.onload = () => {
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
}


function setLoadingState(button, loading) {
    isLoading = loading;
    if (loading) {
        button.disabled = true;
        button.classList.add('loading');
        button.setAttribute('data-original-text', button.textContent);
        button.textContent = button.textContent.replace(/Generate|Send/, 'Loading...');
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        button.textContent = button.getAttribute('data-original-text') || button.textContent.replace('Loading...', 'Send');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatAIResponse(text) {
    // Basic markdown-like formatting
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Provide visual feedback
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.backgroundColor = 'var(--accent-color)';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy to clipboard');
    });
}

// Local storage functions
function saveHistoryToStorage() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function loadHistoryFromStorage() {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
        try {
            chatHistory = JSON.parse(saved);
            updateHistoryDisplay();
        } catch (e) {
            console.error('Error loading history:', e);
        }
    }
}

function clearHistoryFromStorage() {
    localStorage.removeItem('chatHistory');
}

// Add some CSS for the new elements via JavaScript
const additionalStyles = `
<style>
.message {
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: var(--radius-md);
    border-left: 4px solid var(--border-color);
}

.user-message {
    background: rgba(0, 119, 182, 0.05);
    border-left-color: var(--honolulu-blue);
}

.ai-message {
    background: rgba(72, 202, 228, 0.05);
    border-left-color: var(--vivid-sky-blue);
}

.message-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.message-header strong {
    color: var(--text-primary);
}

.timestamp {
    color: var(--text-secondary);
    font-size: 0.8rem;
}

.message-content {
    color: var(--text-primary);
    line-height: 1.5;
}

.copy-btn {
    background: var(--secondary-color);
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 0.9rem;
    margin-top: 1rem;
    transition: all 0.3s ease;
}

.copy-btn:hover {
    background: var(--non-photo-blue-2);
    color: var(--text-primary);
}

#history-box {
    overflow-y: auto;
    max-height: 400px;
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);
