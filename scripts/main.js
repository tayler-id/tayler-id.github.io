// Main JavaScript for Tayler Ramsay's Portfolio

document.addEventListener('DOMContentLoaded', function() {
    // AI Chat Feature
    const aiChatButton = document.getElementById('aiChatButton');
    const aiChatContainer = document.getElementById('aiChatContainer');
    const aiChatClose = document.getElementById('aiChatClose');
    const aiChatInput = document.getElementById('aiChatInput');
    const aiChatSend = document.getElementById('aiChatSend');
    const aiChatMessages = document.getElementById('aiChatMessages');

    // Toggle chat window
    aiChatButton.addEventListener('click', function() {
        aiChatContainer.style.display = 'flex';
        aiChatButton.style.display = 'none';
        aiChatInput.focus();
    });

    aiChatClose.addEventListener('click', function() {
        aiChatContainer.style.display = 'none';
        aiChatButton.style.display = 'flex';
    });

    // Send message function
    function sendMessage() {
        const message = aiChatInput.value.trim();
        if (message) {
            // Add user message
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'ai-chat-message';
            userMessageDiv.innerHTML = `<div class="user-message">${message}</div>`;
            aiChatMessages.appendChild(userMessageDiv);
            
            // Clear input
            aiChatInput.value = '';
            
            // Scroll to bottom
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
            
            // Simulate AI response (in a real implementation, this would call an API)
            setTimeout(function() {
                const aiResponse = getAIResponse(message);
                const aiMessageDiv = document.createElement('div');
                aiMessageDiv.className = 'ai-chat-message';
                aiMessageDiv.innerHTML = `<div class="ai-message">${aiResponse}</div>`;
                aiChatMessages.appendChild(aiMessageDiv);
                
                // Scroll to bottom again
                aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
            }, 1000);
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

    // Simple AI response function (would be replaced with actual AI in production)
    function getAIResponse(message) {
        message = message.toLowerCase();
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! I'm Tayler's AI assistant. How can I help you today?";
        } else if (message.includes('experience') || message.includes('background')) {
            return "Tayler has over 24 years of experience in UX design, evolving from graphic design to modern UX engineering. Would you like to know more about a specific aspect of Tayler's experience?";
        } else if (message.includes('project') || message.includes('work')) {
            return "Tayler has worked on various projects including financial tech solutions, AI-powered design systems, and sustainable digital design research. You can view detailed case studies in the Projects section.";
        } else if (message.includes('contact') || message.includes('hire') || message.includes('work together')) {
            return "You can contact Tayler through the contact form on this website or directly via email at your.email@example.com. Tayler is currently open to new opportunities and collaborations.";
        } else if (message.includes('accessibility') || message.includes('a11y')) {
            return "Accessibility is one of Tayler's core specialties. Tayler has extensive experience implementing WCAG standards and researching cutting-edge accessibility solutions.";
        } else if (message.includes('design system') || message.includes('design systems')) {
            return "Tayler has created and maintained comprehensive design systems for enterprise applications, including an innovative AI-powered Design System Monitor that continuously audits UI components.";
        } else if (message.includes('skill') || message.includes('tools')) {
            return "Tayler's skills include UX design, UI development, accessibility implementation, design systems, and front-end development with tools like Figma, Adobe XD, HTML/CSS, JavaScript, Vue.js, and React.";
        } else {
            return "I'd be happy to help with that. Would you like me to direct you to a specific section of Tayler's portfolio, or would you prefer to discuss something else?";
        }
    }

    // Accessibility features
    const highContrastToggle = document.getElementById('highContrastToggle');
    const fontSizeIncrease = document.getElementById('fontSizeIncrease');
    let fontSizeLevel = 0;
    const maxFontSizeLevel = 2;

    // High contrast mode
    highContrastToggle.addEventListener('click', function() {
        document.body.classList.toggle('high-contrast');
        if (document.body.classList.contains('high-contrast')) {
            document.documentElement.style.setProperty('--primary', '#000000');
            document.documentElement.style.setProperty('--background', '#ffffff');
            document.documentElement.style.setProperty('--text-dark', '#000000');
            document.documentElement.style.setProperty('--text-light', '#ffffff');
            document.documentElement.style.setProperty('--gray-light', '#f0f0f0');
            document.documentElement.style.setProperty('--gray-medium', '#999999');
            document.documentElement.style.setProperty('--gray-dark', '#333333');
        } else {
            document.documentElement.style.setProperty('--primary', '#0D1017');
            document.documentElement.style.setProperty('--background', '#FFFFFF');
            document.documentElement.style.setProperty('--text-dark', '#0D1017');
            document.documentElement.style.setProperty('--text-light', '#FFFFFF');
            document.documentElement.style.setProperty('--gray-light', '#F5F5F5');
            document.documentElement.style.setProperty('--gray-medium', '#CCCCCC');
            document.documentElement.style.setProperty('--gray-dark', '#666666');
        }
    });

    // Font size adjustment
    fontSizeIncrease.addEventListener('click', function() {
        fontSizeLevel = (fontSizeLevel + 1) % (maxFontSizeLevel + 1);
        
        switch(fontSizeLevel) {
            case 0:
                document.body.style.fontSize = '16px';
                break;
            case 1:
                document.body.style.fontSize = '18px';
                break;
            case 2:
                document.body.style.fontSize = '20px';
                break;
        }
    });

    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
            this.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        });
    });

    // Form validation
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name && email && message) {
                // In a real implementation, this would send the form data to a server
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add active class to current nav item based on URL
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (currentLocation.includes(linkPath) && linkPath !== 'index.html') {
            link.classList.add('active');
        } else if (currentLocation.endsWith('/') && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });
});
