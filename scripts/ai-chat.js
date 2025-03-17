// AI Chat JavaScript for Tayler Ramsay's Portfolio

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AI Chat
    initAIChat();
});

// Initialize AI Chat functionality
function initAIChat() {
    const aiChatButton = document.getElementById('aiChatButton');
    const aiChatContainer = document.getElementById('aiChatContainer');
    const aiChatClose = document.getElementById('aiChatClose');
    const aiChatInput = document.getElementById('aiChatInput');
    const aiChatSend = document.getElementById('aiChatSend');
    const aiChatMessages = document.getElementById('aiChatMessages');
    
    // Check if elements exist
    if (!aiChatButton || !aiChatContainer || !aiChatClose || !aiChatInput || !aiChatSend || !aiChatMessages) {
        console.error('AI Chat elements not found');
        return;
    }

    // Toggle chat window
    aiChatButton.addEventListener('click', function() {
        aiChatContainer.classList.add('active');
        aiChatButton.classList.add('hidden');
        aiChatInput.focus();
        
        // Add entrance animation
        aiChatContainer.style.animation = 'slideInRight 0.3s forwards';
    });

    aiChatClose.addEventListener('click', function() {
        // Add exit animation
        aiChatContainer.style.animation = 'slideOutRight 0.3s forwards';
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            aiChatContainer.classList.remove('active');
            aiChatButton.classList.remove('hidden');
        }, 300);
    });

    // Send message function
    function sendMessage() {
        const message = aiChatInput.value.trim();
        if (message) {
            // Add user message with animation
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'ai-chat-message user-message-container';
            userMessageDiv.innerHTML = `
                <div class="user-message">
                    ${escapeHTML(message)}
                </div>
            `;
            aiChatMessages.appendChild(userMessageDiv);
            
            // Animate the new message
            setTimeout(() => {
                userMessageDiv.style.opacity = '1';
                userMessageDiv.style.transform = 'translateY(0)';
            }, 10);
            
            // Clear input
            aiChatInput.value = '';
            
            // Scroll to bottom
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
            
            // Show typing indicator
            showTypingIndicator();
            
            // Get AI response after a delay (simulating processing time)
            setTimeout(() => {
                // Hide typing indicator
                hideTypingIndicator();
                
                // Add AI response with animation
                const aiResponse = getAIResponse(message);
                const aiMessageDiv = document.createElement('div');
                aiMessageDiv.className = 'ai-chat-message ai-message-container';
                aiMessageDiv.innerHTML = `
                    <div class="ai-message">
                        ${aiResponse}
                    </div>
                `;
                aiChatMessages.appendChild(aiMessageDiv);
                
                // Animate the new message
                setTimeout(() => {
                    aiMessageDiv.style.opacity = '1';
                    aiMessageDiv.style.transform = 'translateY(0)';
                }, 10);
                
                // Scroll to bottom again
                aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
            }, 1500);
        }
    }

    // Send message on button click
    aiChatSend.addEventListener('click', sendMessage);

    // Send message on Enter key
    aiChatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Show typing indicator
function showTypingIndicator() {
    const aiChatMessages = document.getElementById('aiChatMessages');
    
    // Create typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-chat-message ai-message-container typing-indicator';
    typingDiv.innerHTML = `
        <div class="ai-message">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;
    aiChatMessages.appendChild(typingDiv);
    
    // Animate the indicator
    setTimeout(() => {
        typingDiv.style.opacity = '1';
        typingDiv.style.transform = 'translateY(0)';
    }, 10);
    
    // Scroll to bottom
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Simple AI response function (would be replaced with actual AI in production)
function getAIResponse(message) {
    message = message.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hello! I'm Tayler's AI assistant. How can I help you today?";
    } else if (message.includes('experience') || message.includes('background')) {
        return "Tayler has over 24 years of experience in UX design, evolving from graphic design to modern UX engineering. Would you like to know more about a specific aspect of Tayler's experience?";
    } else if (message.includes('project') || message.includes('work')) {
        return "Tayler has worked on various projects including financial tech solutions, AI-powered design systems, and sustainable digital design research. You can view detailed case studies in the Projects section.";
    } else if (message.includes('contact') || message.includes('hire')) {
        return "You can contact Tayler through the contact form on this website or directly via email at contact@tayler.id. Tayler is currently open to new opportunities and collaborations.";
    } else if (message.includes('accessibility') || message.includes('a11y')) {
        return "Accessibility is one of Tayler's core specialties. Tayler has extensive experience implementing WCAG standards and researching cutting-edge accessibility solutions.";
    } else if (message.includes('design system')) {
        return "Tayler has created and maintained comprehensive design systems for enterprise applications, including an innovative AI-powered Design System Monitor that continuously audits UI components.";
    } else {
        return "I'd be happy to help with that. Would you like me to direct you to a specific section of Tayler's portfolio, or would you prefer to discuss something else?";
    }
}

// Helper function to escape HTML
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag]));
}
