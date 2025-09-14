// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(45, 45, 45, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(45, 45, 45, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Particle demo iframe handling
document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('particleDemo');
    if (iframe) {
        // Ensure iframe loads properly
        iframe.addEventListener('load', () => {
            console.log('Particle demo loaded successfully');
        });
        
        // Handle iframe load errors
        iframe.addEventListener('error', () => {
            console.error('Failed to load particle demo');
        });
    }
});

// Particle system for hero section (simplified background)
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particlesContainer.appendChild(particle);
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Create particles
    createParticles();
    
    // Observe elements for scroll animations - ensure content is visible
    const animatedElements = document.querySelectorAll('.about-card, .project-card, .contact-card, .stat-item');
    animatedElements.forEach(el => {
        // Don't hide elements initially
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Stagger animation for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Removed parallax effect for hero section to prevent awkward movement

// Project card hover effects and click handling
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Make entire card clickable - click goes to GitHub repo
    card.addEventListener('click', function(e) {
        // Don't trigger if clicking on the overlay links
        if (e.target.closest('.project-overlay')) {
            return;
        }
        
        // Find the GitHub link and click it
        const githubLink = this.querySelector('a[href*="github.com"]');
        if (githubLink) {
            githubLink.click();
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const name = this.querySelector('input[type="text"]').value.trim();
        const email = this.querySelector('input[type="email"]').value.trim();
        const message = this.querySelector('textarea').value.trim();
        
        // Validation
        if (!name || !email || !message) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        if (name.length < 2 || name.length > 100) {
            showMessage('Name must be between 2 and 100 characters', 'error');
            return;
        }
        
        if (message.length < 10 || message.length > 1000) {
            showMessage('Message must be between 10 and 1000 characters', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Get submit button and form
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Determine backend URL based on environment
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const backendUrl = isLocal 
                ? 'http://localhost:3000/api/contact'
                : 'https://portfolio-backend-production.up.railway.app/api/contact';
            
            // Send to backend
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
                this.reset();
            } else {
                showMessage(data.message || 'Failed to send message. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Error:', error);
            showMessage('Failed to send message. Please check your connection and try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Show message function
function showMessage(text, type) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const message = document.createElement('div');
    message.className = `form-message ${type}`;
    message.textContent = text;
    
    // Style the message
    message.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0;
        font-weight: 600;
        text-align: center;
        ${type === 'success' 
            ? 'background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 2px solid #22c55e;' 
            : 'background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 2px solid #ef4444;'
        }
    `;
    
    // Insert after form
    const form = document.querySelector('.contact-form');
    form.appendChild(message);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
}

// Smooth reveal animation for sections
function revealOnScroll() {
    const reveals = document.querySelectorAll('.section-header, .about-content, .projects-grid, .contact-content');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Add active class to navigation links based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Add CSS for active navigation link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
    }
    .nav-link.active::after {
        width: 100%;
    }
    .section-header.active,
    .about-content.active,
    .projects-grid.active,
    .contact-content.active {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add initial styles for animation - ensure content is visible
    const style = document.createElement('style');
    style.textContent = `
        .section-header,
        .about-content,
        .projects-grid,
        .contact-content {
            opacity: 1;
            transform: translateY(0);
            transition: all 0.8s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Trigger initial reveal
    setTimeout(revealOnScroll, 100);
});

// Add floating animation to hero cards
function addFloatingAnimation() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animation = `floatCard 4s ease-in-out infinite`;
        card.style.animationDelay = `${index * 0.5}s`;
    });
}

// Initialize floating animation
document.addEventListener('DOMContentLoaded', addFloatingAnimation);

// Interactive 3D Anvil & Hammer Simulation using Matter.js
class AnvilSimulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Set up high DPI canvas
        this.setupCanvas();
        
        // Initialize Matter.js
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.engine.world.gravity.y = 0.8; // Gravity strength
        
        console.log('Matter.js engine created:', this.engine);
        console.log('World created:', this.world);
        console.log('Engine timing:', this.engine.timing);
        
        // Create hammer components
        this.createHammer();
        
        // Create anvil
        this.createAnvil();
        
        // Create mouse constraint for interaction
        this.createMouseConstraint();
        
        // Sparks array
        this.sparks = [];
        
        // Global sparks that can escape the canvas
        this.globalSparks = [];
        
        // Performance limits
        this.maxSparks = 15; // Limit total sparks
        this.maxGlobalSparks = 25; // Limit global sparks
        this.lastFrameTime = 0;
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        
        // Status logging
        this.statusText = "Hammer Ready";
        this.statusTimeout = null;
        
        // Animation
        this.animationId = null;
        
        // Note: Matter.js engine doesn't have an 'on' method for error handling
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start animation after a longer delay to ensure Matter.js is fully ready
        setTimeout(() => {
            this.startAnimation();
        }, 500);
    }
    
    startAnimation() {
        // Validate that everything is properly initialized before starting
        if (!this.engine || !this.world || !this.hammerHandle || !this.hammerHead) {
            console.log('Simulation not properly initialized, retrying...');
            setTimeout(() => this.startAnimation(), 100);
            return;
        }
        
        // Start the animation loop
        this.animate();
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        console.log('Canvas setup - rect:', rect, 'dpr:', dpr);
        
        // Ensure we have valid dimensions
        if (rect.width <= 0 || rect.height <= 0) {
            console.error('Invalid canvas dimensions:', rect);
            // Set default dimensions
            this.width = 400;
            this.height = 300;
            this.canvas.width = this.width * dpr;
            this.canvas.height = this.height * dpr;
            this.canvas.style.width = this.width + 'px';
            this.canvas.style.height = this.height + 'px';
        } else {
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
            this.width = rect.width;
            this.height = rect.height;
        }
        
        this.ctx.scale(dpr, dpr);
        
        console.log('Canvas setup complete - width:', this.width, 'height:', this.height);
    }
    
    createHammer() {
        console.log('Creating hammer with dimensions:', this.width, this.height);
        console.log('Matter.Bodies available:', typeof Matter.Bodies);
        
        // Hammer handle (wooden part)
        this.hammerHandle = Matter.Bodies.rectangle(
            this.width / 2, 
            this.height / 2 - 30, 
            120, 
            8, 
            { 
                density: 0.001,
                frictionAir: 0.05,
                restitution: 0.3,
                isStatic: false, // Allow movement for mouse interaction
                render: { fillStyle: '#8B4513' }
            }
        );
        
        // Hammer head (metal part)
        this.hammerHead = Matter.Bodies.circle(
            this.width / 2 + 60, 
            this.height / 2 - 30, 
            15, 
            { 
                density: 0.01,
                frictionAir: 0.05,
                restitution: 0.4,
                isStatic: false, // Allow movement for mouse interaction
                render: { fillStyle: '#ff6b35' }
            }
        );
        
        // Add bodies to world first
        Matter.World.add(this.world, [this.hammerHandle, this.hammerHead]);
        
        // Constraint to connect handle and head
        this.hammerConstraint = Matter.Constraint.create({
            bodyA: this.hammerHandle,
            bodyB: this.hammerHead,
            pointA: { x: 60, y: 0 },
            pointB: { x: 0, y: 0 },
            stiffness: 1,
            length: 0
        });
        
        // Add constraint to world
        Matter.World.add(this.world, this.hammerConstraint);
        
        // Add invisible constraints to keep hammer in bounds
        this.addHammerConstraints();
    }
    
    addHammerConstraints() {
        // Add invisible constraints to keep hammer from falling off screen
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // Create a soft constraint to keep hammer near center
        this.hammerCenterConstraint = Matter.Constraint.create({
            bodyA: this.hammerHandle,
            pointB: { x: centerX, y: centerY },
            stiffness: 0.1,
            length: 0,
            render: { visible: false }
        });
        
        Matter.World.add(this.world, this.hammerCenterConstraint);
    }
    
    createAnvil() {
        console.log('Creating anvil with dimensions:', this.width, this.height);
        
        // Anvil body
        this.anvil = Matter.Bodies.rectangle(
            this.width / 2, 
            this.height - 40, 
            100, 
            40, 
            { 
                isStatic: true,
                render: { fillStyle: '#666666' }
            }
        );
        
        console.log('Anvil created successfully');
        
        // Add anvil to world
        Matter.World.add(this.world, this.anvil);
        
        // Create invisible walls to contain the hammer
        this.createWalls();
    }
    
    createWalls() {
        console.log('Creating walls with dimensions:', this.width, this.height);
        const wallThickness = 20;
        
        // Top wall
        this.topWall = Matter.Bodies.rectangle(
            this.width / 2, 
            -wallThickness / 2, 
            this.width, 
            wallThickness, 
            { 
                isStatic: true,
                render: { visible: false }
            }
        );
        
        // Bottom wall
        this.bottomWall = Matter.Bodies.rectangle(
            this.width / 2, 
            this.height + wallThickness / 2, 
            this.width, 
            wallThickness, 
            { 
                isStatic: true,
                render: { visible: false }
            }
        );
        
        // Left wall
        this.leftWall = Matter.Bodies.rectangle(
            -wallThickness / 2, 
            this.height / 2, 
            wallThickness, 
            this.height, 
            { 
                isStatic: true,
                render: { visible: false }
            }
        );
        
        // Right wall
        this.rightWall = Matter.Bodies.rectangle(
            this.width + wallThickness / 2, 
            this.height / 2, 
            wallThickness, 
            this.height, 
            { 
                isStatic: true,
                render: { visible: false }
            }
        );
        
        console.log('Walls created successfully');
        
        // Add walls to world
        Matter.World.add(this.world, [
            this.topWall, 
            this.bottomWall, 
            this.leftWall, 
            this.rightWall
        ]);
    }
    
    createMouseConstraint() {
        console.log('Creating mouse constraint...');
        try {
            // Create mouse for interaction
            this.mouse = Matter.Mouse.create(this.canvas);
            console.log('Mouse created:', this.mouse);
            
            // Create mouse constraint with better settings for interaction
            this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
                mouse: this.mouse,
                constraint: {
                    stiffness: 0.8,
                    length: 0,
                    render: {
                        visible: false
                    }
                }
            });
            console.log('Mouse constraint created successfully');
            
            // Enable mouse interaction on hammer bodies
            if (this.hammerHandle) {
                this.hammerHandle.plugin = this.hammerHandle.plugin || {};
                this.hammerHandle.plugin.mouse = true;
            }
            if (this.hammerHead) {
                this.hammerHead.plugin = this.hammerHead.plugin || {};
                this.hammerHead.plugin.mouse = true;
            }
            
             // Add to world
             Matter.World.add(this.world, this.mouseConstraint);
             console.log('Mouse constraint added to world');
            
            // Add event listeners for mouse constraint
            Matter.Events.on(this.mouseConstraint, 'startdrag', (event) => {
                this.isDragging = true;
                this.lastInteractionTime = Date.now();
                this.updateStatusText('Dragging Hammer');
            });
            
            Matter.Events.on(this.mouseConstraint, 'enddrag', (event) => {
                this.isDragging = false;
                this.lastInteractionTime = Date.now();
                this.updateStatusText('Hammer Released');
            });
            
            // Debug: Log when mouse constraint is created
            console.log('Mouse constraint created successfully');
        } catch (error) {
            console.error('Error creating mouse constraint:', error);
        }
        
        // Custom mouse interaction with constraint
        this.isDragging = false;
        this.dragBody = null;
        this.dragConstraint = null;
        
        // Hammer freezing
        this.hammerFrozen = false; // Start unfrozen for immediate interaction
        this.lastInteractionTime = Date.now(); // Start with current time
        this.freezeDelay = 2000; // Freeze after 2 seconds of no interaction
    }
    
    setupEventListeners() {
        // Canvas setup complete
        
        this.canvas.addEventListener('click', (e) => {
            // Unfreeze hammer when clicked
            if (this.hammerFrozen) {
                this.hammerFrozen = false;
                Matter.Body.setStatic(this.hammerHandle, false);
                Matter.Body.setStatic(this.hammerHead, false);
                this.lastInteractionTime = Date.now();
                this.updateStatusText('Hammer Ready - Drag to Swing');
            }
        });
        
        // Update mouse position for Matter.js
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (this.mouse) {
                this.mouse.position.x = x;
                this.mouse.position.y = y;
            }
        });
        
        // Matter.js built-in mouse constraint handles all interaction automatically
        
        this.canvas.addEventListener('mouseleave', (e) => {
            // Clean up and freeze hammer
            this.isDragging = false;
            this.dragBody = null;
            
            // Clean up drag constraint
            this.cleanupDragConstraint();
            
            // Freeze hammer immediately when mouse leaves
            this.hammerFrozen = true;
            Matter.Body.setStatic(this.hammerHandle, true);
            Matter.Body.setStatic(this.hammerHead, true);
            Matter.Body.setVelocity(this.hammerHandle, { x: 0, y: 0 });
            Matter.Body.setVelocity(this.hammerHead, { x: 0, y: 0 });
            Matter.Body.setAngularVelocity(this.hammerHandle, 0);
            Matter.Body.setAngularVelocity(this.hammerHead, 0);
            this.updateStatusText('Hammer Frozen (Mouse Left)');
        });
        
        // Add collision detection
        Matter.Events.on(this.engine, 'collisionStart', (event) => {
            try {
                const pairs = event.pairs;
                
                if (!pairs || !Array.isArray(pairs)) {
                    console.log('Invalid collision event');
                    return;
                }
                
                for (let i = 0; i < pairs.length; i++) {
                    try {
                        const pair = pairs[i];
                        
                        // Check if pair and bodies are valid
                        if (!pair || !pair.bodyA || !pair.bodyB || 
                            !pair.bodyA.id || !pair.bodyB.id) {
                            continue;
                        }
                        
                        // Check if hammer head hit anvil
                        if ((pair.bodyA === this.hammerHead && pair.bodyB === this.anvil) ||
                            (pair.bodyA === this.anvil && pair.bodyB === this.hammerHead)) {
                            
                            // Calculate head speed for sparks
                            const headSpeed = Math.sqrt(
                                this.hammerHead.velocity.x ** 2 + this.hammerHead.velocity.y ** 2
                            );
                            
                            this.createSparks(headSpeed);
                        }
                    } catch (pairError) {
                        console.log('Pair error:', pairError);
                    }
                }
            } catch (error) {
                console.log('Collision detection error:', error);
            }
        });
    }
    
    createDragConstraint(x, y) {
        // Clean up any existing constraint first
        this.cleanupDragConstraint();
        
        // Check if drag body exists and is valid
        if (!this.dragBody || !this.dragBody.id || !this.dragBody.position) {
            console.log('Invalid drag body, cannot create constraint');
            this.dragBody = null;
            return;
        }
        
        // Verify the drag body is still in the world
        if (!this.world.bodies.includes(this.dragBody)) {
            console.log('Drag body not in world, cannot create constraint');
            this.dragBody = null;
            return;
        }
        
        try {
            // Create a temporary constraint for smooth dragging
            this.dragConstraint = Matter.Constraint.create({
                bodyA: this.dragBody,
                pointB: { x: x, y: y },
                stiffness: 0.9,
                length: 0,
                render: {
                    visible: false
                }
            });
            
            // Add constraint to world
            Matter.World.add(this.world, this.dragConstraint);
            
            console.log('Drag constraint created successfully');
        } catch (error) {
            console.log('Error creating constraint:', error);
            this.dragConstraint = null;
        }
    }
    
    cleanupDragConstraint() {
        if (this.dragConstraint) {
            try {
                // Remove constraint from world
                Matter.World.remove(this.world, this.dragConstraint);
                console.log('Drag constraint cleaned up');
            } catch (error) {
                console.log('Error cleaning up constraint:', error);
            }
            this.dragConstraint = null;
        }
    }
    
    recoverFromInvalidPositions() {
        console.log('Attempting to recover from invalid positions...');
        
        try {
            // Reset hammer positions to safe values
            const safeHandleX = this.width * 0.5;
            const safeHandleY = this.height * 0.4;
            const safeHeadX = this.width * 0.6;
            const safeHeadY = this.height * 0.4;
            
            // Reset positions
            Matter.Body.setPosition(this.hammerHandle, { x: safeHandleX, y: safeHandleY });
            Matter.Body.setPosition(this.hammerHead, { x: safeHeadX, y: safeHeadY });
            
            // Reset velocities
            Matter.Body.setVelocity(this.hammerHandle, { x: 0, y: 0 });
            Matter.Body.setVelocity(this.hammerHead, { x: 0, y: 0 });
            Matter.Body.setAngularVelocity(this.hammerHandle, 0);
            Matter.Body.setAngularVelocity(this.hammerHead, 0);
            
            // Freeze the hammer to prevent further issues
            this.hammerFrozen = true;
            Matter.Body.setStatic(this.hammerHandle, true);
            Matter.Body.setStatic(this.hammerHead, true);
            
            // Clean up any active dragging
            this.isDragging = false;
            this.dragBody = null;
            this.cleanupDragConstraint();
            
            console.log('Position recovery completed');
        } catch (error) {
            console.error('Error during position recovery:', error);
        }
    }
    
    validateConstraints() {
        // Temporarily disabled to test position corruption
        return;
        
        // Check all constraints in the world
        if (this.world && this.world.constraints) {
            const invalidConstraints = [];
            
            for (let constraint of this.world.constraints) {
                // Check if constraint has valid bodies and they exist in the world
                if (!constraint || !constraint.bodyA || !constraint.bodyB || 
                    !constraint.bodyA.id || !constraint.bodyB.id ||
                    !this.world.bodies.includes(constraint.bodyA) || 
                    !this.world.bodies.includes(constraint.bodyB)) {
                    invalidConstraints.push(constraint);
                }
            }
            
            // Remove invalid constraints
            for (let constraint of invalidConstraints) {
                try {
                    Matter.World.remove(this.world, constraint);
                } catch (e) {
                    console.log('Error removing invalid constraint:', e);
                }
            }
            
            // If our drag constraint was invalid, clean it up
            if (this.dragConstraint && invalidConstraints.includes(this.dragConstraint)) {
                this.dragConstraint = null;
                this.isDragging = false;
                this.dragBody = null;
            }
        }
    }
    
    createSparks(speed) {
        // Limit total sparks for performance
        if (this.sparks.length >= this.maxSparks) {
            return;
        }
        
        const sparkCount = Math.min(Math.floor(speed * 2), 12); // More sparks for better effect
        
        for (let i = 0; i < sparkCount && this.sparks.length < this.maxSparks; i++) {
            const angle = Math.random() * Math.PI * 2;
            const sparkSpeed = speed * (0.3 + Math.random() * 0.7);
            
            this.sparks.push({
                x: this.hammerHead.position.x + (Math.random() - 0.5) * 15,
                y: this.anvil.position.y + Math.random() * 8,
                vx: Math.cos(angle) * sparkSpeed * 0.4,
                vy: -Math.random() * sparkSpeed * 0.6,
                life: 1.0,
                maxLife: 0.6 + Math.random() * 0.8, // 0.6-1.4 seconds
                decay: 0.025 + Math.random() * 0.015, // Faster fade: 0.025-0.04
                size: 1 + Math.random() * 4, // 1-5 pixels
                baseSize: 1 + Math.random() * 4,
                color: this.getSparkColor(),
                glowSize: 3 + Math.random() * 6, // Glow radius
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.4,
                gravity: 0.2 + Math.random() * 0.3,
                airResistance: 0.985 + Math.random() * 0.01,
                trail: [], // Array to store trail positions
                maxTrailLength: 8,
                isDisintegrating: false,
                binaryParticles: [] // For Matrix-style disintegration
            });
        }
    }
    
    getSparkColor() {
        const colors = [
            '#FFD700', // Gold
            '#FFA500', // Orange
            '#FF4500', // Red-orange
            '#FF6347', // Tomato
            '#FFFF00', // Yellow
            '#FFE135', // Golden yellow
            '#FF8C00', // Dark orange
            '#FF7F50'  // Coral
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    updateSparks() {
        for (let i = this.sparks.length - 1; i >= 0; i--) {
            const spark = this.sparks[i];
            
            // Add current position to trail
            spark.trail.push({ x: spark.x, y: spark.y, life: spark.life });
            
            // Limit trail length
            if (spark.trail.length > spark.maxTrailLength) {
                spark.trail.shift();
            }
            
            // Update position
            spark.x += spark.vx;
            spark.y += spark.vy;
            spark.vy += 0.3; // Gravity
            spark.life -= spark.decay;
            
            // Check if spark is leaving the frame
            const margin = 50;
            const isLeaving = spark.x < -margin || spark.x > this.width + margin || 
                             spark.y < -margin || spark.y > this.height + margin;
            
            if (isLeaving && !spark.isDisintegrating) {
                // Convert to global spark that can fly around the webpage
                this.convertToGlobalSpark(spark);
                this.sparks.splice(i, 1);
                continue;
            }
            
            // Update binary particles if disintegrating
            if (spark.isDisintegrating) {
                this.updateBinaryParticles(spark);
            }
            
            // Remove spark if life is over or if it's fully disintegrated
            if (spark.life <= 0 || (spark.isDisintegrating && spark.binaryParticles.length === 0)) {
                this.sparks.splice(i, 1);
            }
        }
    }
    
    createBinaryDisintegration(spark) {
        const binaryCount = 20 + Math.random() * 10; // Reduced count for performance
        
        for (let i = 0; i < binaryCount; i++) {
            spark.binaryParticles.push({
                x: spark.x + (Math.random() - 0.5) * 80, // Much larger spread
                y: spark.y + (Math.random() - 0.5) * 80,
                vx: (Math.random() - 0.5) * 8, // Faster initial velocity
                vy: (Math.random() - 0.5) * 8,
                life: 1.0,
                decay: 0.0005 + Math.random() * 0.001, // Extremely slow decay for very gradual fade
                char: Math.random() > 0.5 ? '1' : '0',
                size: 8 + Math.random() * 6, // Smaller size for performance
                maxLife: 1.0 // Track original life for fade timing
            });
        }
    }
    
    updateBinaryParticles(spark) {
        for (let i = spark.binaryParticles.length - 1; i >= 0; i--) {
            const particle = spark.binaryParticles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Apply friction and gravity
            particle.vx *= 0.998; // Even less friction for longer movement
            particle.vy *= 0.998;
            particle.vy += 0.01; // Very light gravity
            
            // Very gradual fade - only fade when life is below 0.3
            if (particle.life > 0.3) {
                // Keep full opacity while spreading
                particle.life = 1.0;
            } else {
                // Very slow fade once spreading is done
                particle.life -= particle.decay * 0.1; // Extremely slow fade
            }
            
            // Add some random drift for organic movement
            particle.vx += (Math.random() - 0.5) * 0.005;
            particle.vy += (Math.random() - 0.5) * 0.005;
            
            // Only remove when completely invisible to prevent snapping
            if (particle.life <= 0.0001) {
                spark.binaryParticles.splice(i, 1);
            }
        }
    }
    
    convertToGlobalSpark(spark) {
        // Limit global sparks for performance
        if (this.globalSparks.length >= this.maxGlobalSparks) {
            return;
        }
        
        // Convert canvas coordinates to global page coordinates
        const canvasRect = this.canvas.getBoundingClientRect();
        const globalX = canvasRect.left + spark.x;
        const globalY = canvasRect.top + spark.y;
        
        // Convert trail coordinates to global space
        const globalTrail = spark.trail.map(trailPoint => ({
            x: canvasRect.left + trailPoint.x,
            y: canvasRect.top + trailPoint.y,
            life: trailPoint.life
        }));
        
        // Create global spark with enhanced movement
        const globalSpark = {
            x: globalX,
            y: globalY,
            vx: spark.vx, // Keep same velocity for smooth transition
            vy: spark.vy,
            life: 1.0, // Full life when converting
            decay: 0.003, // Moderate decay
            size: spark.size * 1.5, // Bigger sparks
            trail: globalTrail, // Use converted trail
            maxTrailLength: 10, // Reduced trail length for performance
            isDisintegrating: false,
            binaryParticles: [],
            zIndex: 1000, // High z-index to appear above everything
            wanderTime: 0, // Time spent wandering
            maxWanderTime: 5000, // Moderate wandering time (5 seconds)
            transitionTime: 0, // Time since conversion
            maxTransitionTime: 1000 // Transition period (1 second)
        };
        
        this.globalSparks.push(globalSpark);
    }
    
    updateGlobalSparks() {
        // Update transition time for all sparks
        this.globalSparks.forEach(spark => {
            spark.transitionTime += 16;
            spark.wanderTime += 16;
        });
        
        // Apply particle simulation physics
        this.applyParticlePhysics();
        
        for (let i = this.globalSparks.length - 1; i >= 0; i--) {
            const spark = this.globalSparks[i];
            
            // Add current position to trail with some randomness for organic look
            spark.trail.push({ 
                x: spark.x + (Math.random() - 0.5) * 3, 
                y: spark.y + (Math.random() - 0.5) * 3, 
                life: spark.life 
            });
            
            // Limit trail length
            if (spark.trail.length > spark.maxTrailLength) {
                spark.trail.shift();
            }
            
            // Update position
            spark.x += spark.vx;
            spark.y += spark.vy;
            
            // Apply friction
            spark.vx *= 0.998;
            spark.vy *= 0.998;
            
            spark.life -= spark.decay;
            
            // Check if it's time to disintegrate
            if (spark.wanderTime > spark.maxWanderTime && !spark.isDisintegrating) {
                spark.isDisintegrating = true;
                this.createBinaryDisintegration(spark);
            }
            
            // Update binary particles if disintegrating
            if (spark.isDisintegrating) {
                this.updateBinaryParticles(spark);
            }
            
            // Remove spark if life is over or fully disintegrated
            if (spark.life <= 0 || (spark.isDisintegrating && spark.binaryParticles.length === 0)) {
                this.globalSparks.splice(i, 1);
            }
        }
    }
    
    applyParticlePhysics() {
        const sparks = this.globalSparks;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        for (let i = 0; i < sparks.length; i++) {
            const spark1 = sparks[i];
            
            // Screen boundary collision with bounce
            if (spark1.x < 0 || spark1.x > screenWidth) {
                spark1.vx *= -0.8; // Bounce with energy loss
                spark1.x = Math.max(0, Math.min(screenWidth, spark1.x));
            }
            if (spark1.y < 0 || spark1.y > screenHeight) {
                spark1.vy *= -0.8; // Bounce with energy loss
                spark1.y = Math.max(0, Math.min(screenHeight, spark1.y));
            }
            
            // Particle-to-particle interactions
            for (let j = i + 1; j < sparks.length; j++) {
                const spark2 = sparks[j];
                
                const dx = spark2.x - spark1.x;
                const dy = spark2.y - spark1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = (spark1.size + spark2.size) * 2;
                
                if (distance < minDistance && distance > 0) {
                    // Collision response
                    const overlap = minDistance - distance;
                    const separationX = (dx / distance) * overlap * 0.5;
                    const separationY = (dy / distance) * overlap * 0.5;
                    
                    // Separate particles
                    spark1.x -= separationX;
                    spark1.y -= separationY;
                    spark2.x += separationX;
                    spark2.y += separationY;
                    
                    // Exchange momentum
                    const relativeVelocityX = spark2.vx - spark1.vx;
                    const relativeVelocityY = spark2.vy - spark1.vy;
                    const relativeVelocityDotProduct = relativeVelocityX * dx + relativeVelocityY * dy;
                    
                    if (relativeVelocityDotProduct > 0) {
                        const impulse = (2 * relativeVelocityDotProduct) / (distance * distance);
                        const impulseX = impulse * dx;
                        const impulseY = impulse * dy;
                        
                        spark1.vx += impulseX * 0.5;
                        spark1.vy += impulseY * 0.5;
                        spark2.vx -= impulseX * 0.5;
                        spark2.vy -= impulseY * 0.5;
                    }
                } else if (distance < minDistance * 3 && distance > minDistance) {
                    // Attraction force for nearby particles
                    const force = 0.01 / (distance * distance);
                    const forceX = (dx / distance) * force;
                    const forceY = (dy / distance) * force;
                    
                    spark1.vx += forceX;
                    spark1.vy += forceY;
                    spark2.vx -= forceX;
                    spark2.vy -= forceY;
                }
            }
            
            // Add some organic movement
            if (spark1.transitionTime > spark1.maxTransitionTime) {
                // Gentle random forces
                spark1.vx += (Math.random() - 0.5) * 0.02;
                spark1.vy += (Math.random() - 0.5) * 0.02;
                
                // Swirling motion
                const centerX = screenWidth / 2;
                const centerY = screenHeight / 2;
                const toCenterX = centerX - spark1.x;
                const toCenterY = centerY - spark1.y;
                const toCenterDistance = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY);
                
                if (toCenterDistance > 0) {
                    const swirlForce = 0.001;
                    const perpendicularX = -toCenterY / toCenterDistance;
                    const perpendicularY = toCenterX / toCenterDistance;
                    
                    spark1.vx += perpendicularX * swirlForce;
                    spark1.vy += perpendicularY * swirlForce;
                }
            }
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0d0d0d';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw background gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#1a1a1a');
        gradient.addColorStop(1, '#0d0d0d');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw anvil
        this.drawAnvil();
        
        // Draw hammer
        this.drawHammer();
        
        // Draw sparks
        this.drawSparks();
        
        // Draw status text
        this.drawStatusText();
    }
    
    drawAnvil() {
        if (!this.anvil || !this.anvil.position) {
            console.log('Anvil not ready:', this.anvil);
            return;
        }
        
        const centerX = this.anvil.position.x;
        const centerY = this.anvil.position.y;
        const width = 100;
        const height = 40;
        
        // Check for valid values
        if (!isFinite(centerX) || !isFinite(centerY)) {
            console.log('Anvil position invalid:', centerX, centerY);
            return;
        }
        
        // Anvil shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(centerX - width/2 + 3, centerY - height/2 + 3, width, height);
        
        // Anvil body
        const anvilGradient = this.ctx.createLinearGradient(centerX - width/2, centerY - height/2, centerX + width/2, centerY + height/2);
        anvilGradient.addColorStop(0, '#666666');
        anvilGradient.addColorStop(0.5, '#444444');
        anvilGradient.addColorStop(1, '#222222');
        
        this.ctx.fillStyle = anvilGradient;
        this.ctx.fillRect(centerX - width/2, centerY - height/2, width, height);
        
        // Anvil face
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(centerX - 20, centerY - height/2, 40, height);
    }
    
    resetHammerPositions() {
        // Reset hammer to valid positions
        const handleX = this.width / 2;
        const handleY = this.height / 2 - 30;
        const headX = this.width / 2 + 60;
        const headY = this.height / 2 - 30;
        
        console.log('Before reset - Handle position:', this.hammerHandle.position);
        console.log('Before reset - Head position:', this.hammerHead.position);
        console.log('Handle isStatic:', this.hammerHandle.isStatic);
        console.log('Head isStatic:', this.hammerHead.isStatic);
        
        // Make sure bodies are not static before setting position
        Matter.Body.setStatic(this.hammerHandle, false);
        Matter.Body.setStatic(this.hammerHead, false);
        
        // Try setting position using different methods
        try {
            Matter.Body.setPosition(this.hammerHandle, { x: handleX, y: handleY });
            Matter.Body.setPosition(this.hammerHead, { x: headX, y: headY });
            
            // Alternative method - set position directly
            this.hammerHandle.position.x = handleX;
            this.hammerHandle.position.y = handleY;
            this.hammerHead.position.x = headX;
            this.hammerHead.position.y = headY;
            
            Matter.Body.setVelocity(this.hammerHandle, { x: 0, y: 0 });
            Matter.Body.setVelocity(this.hammerHead, { x: 0, y: 0 });
            Matter.Body.setAngularVelocity(this.hammerHandle, 0);
            Matter.Body.setAngularVelocity(this.hammerHead, 0);
            
            console.log('Hammer positions reset to valid values');
            console.log('Handle position after reset:', this.hammerHandle.position);
            console.log('Head position after reset:', this.hammerHead.position);
        } catch (error) {
            console.error('Error resetting hammer positions:', error);
        }
    }
    
    drawHammer() {
        if (!this.hammerHandle || !this.hammerHead || 
            !this.hammerHandle.position || !this.hammerHead.position) {
            console.log('Hammer not ready:', this.hammerHandle, this.hammerHead);
            return;
        }
        
        // Position validation disabled to prevent infinite reset loop
        // if (!isFinite(this.hammerHandle.position.x) || !isFinite(this.hammerHandle.position.y) ||
        //     !isFinite(this.hammerHead.position.x) || !isFinite(this.hammerHead.position.y)) {
        //     console.log('Hammer position invalid, resetting:', this.hammerHandle.position, this.hammerHead.position);
        //     this.resetHammerPositions();
        //     return;
        // }
        
        // Draw handle
        this.ctx.save();
        this.ctx.translate(this.hammerHandle.position.x, this.hammerHandle.position.y);
        this.ctx.rotate(this.hammerHandle.angle);
        
        // Handle shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(-60 + 2, -4 + 2, 120, 8);
        
        // Handle body
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(-60, -4, 120, 8);
        
        // Handle highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.fillRect(-60, -4, 120, 2);
        
        this.ctx.restore();
        
        // Draw head
        this.ctx.save();
        this.ctx.translate(this.hammerHead.position.x, this.hammerHead.position.y);
        
        // Head shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(2, 2, 15, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Head body
        const headGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
        headGradient.addColorStop(0, '#ff6b35');
        headGradient.addColorStop(0.7, '#e55a2b');
        headGradient.addColorStop(1, '#cc4a1f');
        
        this.ctx.fillStyle = headGradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 15, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Head highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(-5, -5, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawSparks() {
        this.sparks.forEach(spark => {
            this.ctx.save();
            
            // Draw realistic spark with multiple layers
            this.drawSparkGlow(spark);
            this.drawSparkTrail(spark);
            this.drawSparkCore(spark);
            
            this.ctx.restore();
        });
    }
    
    drawSparkGlow(spark) {
        // Outer glow effect with brightness curve that maintains brightness longer
        const brightness = Math.pow(spark.life, 0.6); // Slower brightness decay
        const glowRadius = spark.glowSize * brightness;
        const glowGradient = this.ctx.createRadialGradient(
            spark.x, spark.y, 0,
            spark.x, spark.y, glowRadius
        );
        glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        glowGradient.addColorStop(0.3, `rgba(255, 200, 0, ${0.6 * brightness})`); // Increased from 0.3 to 0.6
        glowGradient.addColorStop(0.7, `rgba(255, 100, 0, ${0.4 * brightness})`); // Increased from 0.2 to 0.4
        glowGradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
        
        this.ctx.fillStyle = glowGradient;
        this.ctx.globalAlpha = brightness * 1.2; // Increased overall alpha
        this.ctx.beginPath();
        this.ctx.arc(spark.x, spark.y, glowRadius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawSparkTrail(spark) {
        if (spark.trail.length > 1) {
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            
            // Draw trail with realistic metal spark colors
            for (let i = 0; i < spark.trail.length - 1; i++) {
                const current = spark.trail[i];
                const next = spark.trail[i + 1];
                const progress = i / spark.trail.length;
                
                // Trail fades and gets thinner with brightness curve
                const brightness = Math.pow(spark.life, 0.6);
                const trailAlpha = progress * brightness * 1.2; // Increased from 0.8 to 1.2
                const trailWidth = (spark.baseSize * 0.5) * (1 - progress) * brightness;
                
                if (trailWidth > 0.1 && trailAlpha > 0.01) {
                    this.ctx.globalAlpha = trailAlpha;
                    this.ctx.lineWidth = trailWidth;
                    
                    // Create realistic metal spark gradient
                    const trailGradient = this.ctx.createLinearGradient(
                        current.x, current.y, next.x, next.y
                    );
                    trailGradient.addColorStop(0, '#FFD700'); // Gold
                    trailGradient.addColorStop(0.3, '#FFA500'); // Orange
                    trailGradient.addColorStop(0.7, '#FF4500'); // Red-orange
                    trailGradient.addColorStop(1, '#FF6347'); // Tomato
                    
                    this.ctx.strokeStyle = trailGradient;
                    this.ctx.beginPath();
                    this.ctx.moveTo(current.x, current.y);
                    this.ctx.lineTo(next.x, next.y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    drawSparkCore(spark) {
        // Main spark core with realistic metal appearance
        const brightness = Math.pow(spark.life, 0.6); // Slower brightness decay
        const coreSize = spark.size * brightness;
        
        // If disintegrating, gradually fade the spark as binary particles appear
        let sparkAlpha = brightness * 1.3; // Increased base opacity
        if (spark.isDisintegrating) {
            // Calculate how much of the binary effect has appeared
            const binaryProgress = spark.binaryParticles.length / (20 + Math.random() * 10);
            // Fade spark as binary particles appear (inverse relationship)
            sparkAlpha = brightness * 1.3 * (1 - binaryProgress * 0.7); // Keep some spark visible longer
        }
        
        // White hot center
        const coreGradient = this.ctx.createRadialGradient(
            spark.x, spark.y, 0,
            spark.x, spark.y, coreSize
        );
        coreGradient.addColorStop(0, '#FFFFFF'); // White hot center
        coreGradient.addColorStop(0.3, spark.color); // Main spark color
        coreGradient.addColorStop(0.7, this.darkenColor(spark.color, 0.3));
        coreGradient.addColorStop(1, this.darkenColor(spark.color, 0.6));
        
        this.ctx.fillStyle = coreGradient;
        this.ctx.globalAlpha = sparkAlpha;
        this.ctx.beginPath();
        this.ctx.arc(spark.x, spark.y, coreSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add bright highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // Increased from 0.8 to 0.9
        this.ctx.globalAlpha = sparkAlpha * 0.8; // Increased from 0.6 to 0.8
        this.ctx.beginPath();
        this.ctx.arc(spark.x - coreSize * 0.3, spark.y - coreSize * 0.3, coreSize * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    darkenColor(color, factor) {
        // Simple color darkening function
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - factor));
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - factor));
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - factor));
        return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    }
    
    drawBinaryParticles(spark) {
        this.ctx.save();
        this.ctx.font = 'bold 12px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Calculate how much of the binary effect should be visible
        const totalBinaryCount = 20 + Math.random() * 10;
        const binaryProgress = spark.binaryParticles.length / totalBinaryCount;
        
        spark.binaryParticles.forEach((particle, index) => {
            // Particles appear gradually based on their creation order
            const appearanceProgress = index / spark.binaryParticles.length;
            const shouldShow = appearanceProgress <= binaryProgress;
            
            if (shouldShow) {
                // Smooth fade with easing - particles start invisible and fade in
                const fadeInProgress = Math.min(1, (binaryProgress - appearanceProgress) * 3);
                const alpha = particle.life * particle.life * 0.6 * fadeInProgress;
                this.ctx.globalAlpha = alpha;
                
                // Color fades from white to transparent with spark-like colors
                const whiteIntensity = Math.floor(255 * particle.life);
                const sparkColor = spark.color || '#FFD700';
                const colorIntensity = Math.floor(255 * particle.life);
                
                // Mix white with spark color for firework effect
                this.ctx.fillStyle = `rgb(${whiteIntensity}, ${Math.floor(colorIntensity * 0.8)}, ${Math.floor(colorIntensity * 0.4)})`;
                this.ctx.shadowColor = `rgb(${whiteIntensity}, ${Math.floor(colorIntensity * 0.8)}, ${Math.floor(colorIntensity * 0.4)})`;
                this.ctx.shadowBlur = 4 * particle.life * fadeInProgress;
                
                this.ctx.fillText(particle.char, particle.x, particle.y);
            }
        });
        
        this.ctx.restore();
    }
    
    drawGlobalSparks() {
        // Create or get global canvas overlay
        if (!this.globalCanvas) {
            this.createGlobalCanvas();
        }
        
        // Clear global canvas
        this.globalCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Draw connections between nearby sparks
        this.drawSparkConnections();
        
        this.globalSparks.forEach(spark => {
            this.globalCtx.save();
            
            // Use the same beautiful rendering as frame sparks
            this.drawGlobalSparkGlow(spark);
            this.drawGlobalSparkTrail(spark);
            this.drawGlobalSparkCore(spark);
            
            // Draw binary particles if disintegrating
            if (spark.isDisintegrating) {
                this.drawGlobalBinaryParticles(spark);
            }
            
            this.globalCtx.restore();
        });
    }
    
    drawGlobalSparkGlow(spark) {
        // Outer glow effect for global sparks with brightness curve
        const brightness = Math.pow(spark.life, 0.6); // Slower brightness decay
        const glowRadius = (spark.glowSize || 6) * brightness;
        const glowGradient = this.globalCtx.createRadialGradient(
            spark.x, spark.y, 0,
            spark.x, spark.y, glowRadius
        );
        glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        glowGradient.addColorStop(0.3, `rgba(255, 200, 0, ${0.6 * brightness})`); // Increased from 0.3 to 0.6
        glowGradient.addColorStop(0.7, `rgba(255, 100, 0, ${0.4 * brightness})`); // Increased from 0.2 to 0.4
        glowGradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
        
        this.globalCtx.fillStyle = glowGradient;
        this.globalCtx.globalAlpha = brightness * 1.2; // Increased overall alpha
        this.globalCtx.beginPath();
        this.globalCtx.arc(spark.x, spark.y, glowRadius, 0, Math.PI * 2);
        this.globalCtx.fill();
    }
    
    drawGlobalSparkTrail(spark) {
        if (spark.trail.length > 1) {
            this.globalCtx.lineCap = 'round';
            this.globalCtx.lineJoin = 'round';
            
            // Draw trail with realistic metal spark colors
            for (let i = 0; i < spark.trail.length - 1; i++) {
                const current = spark.trail[i];
                const next = spark.trail[i + 1];
                const progress = i / spark.trail.length;
                
                // Trail fades and gets thinner with brightness curve
                const brightness = Math.pow(spark.life, 0.6);
                const trailAlpha = progress * brightness * 1.2; // Increased from 0.8 to 1.2
                const trailWidth = ((spark.baseSize || 3) * 0.5) * (1 - progress) * brightness;
                
                if (trailWidth > 0.1 && trailAlpha > 0.01) {
                    this.globalCtx.globalAlpha = trailAlpha;
                    this.globalCtx.lineWidth = trailWidth;
                    
                    // Create realistic metal spark gradient
                    const trailGradient = this.globalCtx.createLinearGradient(
                        current.x, current.y, next.x, next.y
                    );
                    trailGradient.addColorStop(0, '#FFD700'); // Gold
                    trailGradient.addColorStop(0.3, '#FFA500'); // Orange
                    trailGradient.addColorStop(0.7, '#FF4500'); // Red-orange
                    trailGradient.addColorStop(1, '#FF6347'); // Tomato
                    
                    this.globalCtx.strokeStyle = trailGradient;
                    this.globalCtx.beginPath();
                    this.globalCtx.moveTo(current.x, current.y);
                    this.globalCtx.lineTo(next.x, next.y);
                    this.globalCtx.stroke();
                }
            }
        }
    }
    
    drawGlobalSparkCore(spark) {
        // Main spark core with realistic metal appearance
        const brightness = Math.pow(spark.life, 0.6); // Slower brightness decay
        const coreSize = (spark.size || 3) * brightness;
        const sparkColor = spark.color || '#FFD700';
        
        // If disintegrating, gradually fade the spark as binary particles appear
        let sparkAlpha = brightness * 1.3; // Increased base opacity
        if (spark.isDisintegrating) {
            // Calculate how much of the binary effect has appeared
            const binaryProgress = spark.binaryParticles.length / (20 + Math.random() * 10);
            // Fade spark as binary particles appear (inverse relationship)
            sparkAlpha = brightness * 1.3 * (1 - binaryProgress * 0.7); // Keep some spark visible longer
        }
        
        // White hot center
        const coreGradient = this.globalCtx.createRadialGradient(
            spark.x, spark.y, 0,
            spark.x, spark.y, coreSize
        );
        coreGradient.addColorStop(0, '#FFFFFF'); // White hot center
        coreGradient.addColorStop(0.3, sparkColor); // Main spark color
        coreGradient.addColorStop(0.7, this.darkenColor(sparkColor, 0.3));
        coreGradient.addColorStop(1, this.darkenColor(sparkColor, 0.6));
        
        this.globalCtx.fillStyle = coreGradient;
        this.globalCtx.globalAlpha = sparkAlpha;
        this.globalCtx.beginPath();
        this.globalCtx.arc(spark.x, spark.y, coreSize, 0, Math.PI * 2);
        this.globalCtx.fill();
        
        // Add bright highlight
        this.globalCtx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // Increased from 0.8 to 0.9
        this.globalCtx.globalAlpha = sparkAlpha * 0.8; // Increased from 0.6 to 0.8
        this.globalCtx.beginPath();
        this.globalCtx.arc(spark.x - coreSize * 0.3, spark.y - coreSize * 0.3, coreSize * 0.3, 0, Math.PI * 2);
        this.globalCtx.fill();
    }
    
    drawSparkConnections() {
        const maxConnectionDistance = 200; // Increased connection distance
        
        for (let i = 0; i < this.globalSparks.length; i++) {
            for (let j = i + 1; j < this.globalSparks.length; j++) {
                const spark1 = this.globalSparks[i];
                const spark2 = this.globalSparks[j];
                
                const dx = spark2.x - spark1.x;
                const dy = spark2.y - spark1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxConnectionDistance) {
                    const alpha = (1 - distance / maxConnectionDistance) * 0.6 * Math.min(spark1.life, spark2.life);
                    
                    this.globalCtx.save();
                    this.globalCtx.globalAlpha = alpha;
                    
                    // Create gradient for connection
                    const gradient = this.globalCtx.createLinearGradient(
                        spark1.x, spark1.y, spark2.x, spark2.y
                    );
                    gradient.addColorStop(0, '#ffaa00');
                    gradient.addColorStop(0.5, '#ff6600');
                    gradient.addColorStop(1, '#ffaa00');
                    
                    this.globalCtx.strokeStyle = gradient;
                    this.globalCtx.lineWidth = 2;
                    this.globalCtx.lineCap = 'round';
                    this.globalCtx.shadowColor = '#ffaa00';
                    this.globalCtx.shadowBlur = 5;
                    
                    this.globalCtx.beginPath();
                    this.globalCtx.moveTo(spark1.x, spark1.y);
                    this.globalCtx.lineTo(spark2.x, spark2.y);
                    this.globalCtx.stroke();
                    this.globalCtx.restore();
                }
            }
        }
    }
    
    createGlobalCanvas() {
        // Create a full-screen canvas overlay
        this.globalCanvas = document.createElement('canvas');
        this.globalCanvas.style.position = 'fixed';
        this.globalCanvas.style.top = '0';
        this.globalCanvas.style.left = '0';
        this.globalCanvas.style.width = '100vw';
        this.globalCanvas.style.height = '100vh';
        this.globalCanvas.style.pointerEvents = 'none';
        this.globalCanvas.style.zIndex = '1000';
        this.globalCanvas.width = window.innerWidth;
        this.globalCanvas.height = window.innerHeight;
        
        this.globalCtx = this.globalCanvas.getContext('2d');
        
        document.body.appendChild(this.globalCanvas);
        
        // Update canvas size on window resize
        window.addEventListener('resize', () => {
            this.globalCanvas.width = window.innerWidth;
            this.globalCanvas.height = window.innerHeight;
        });
    }
    
    drawGlobalBinaryParticles(spark) {
        this.globalCtx.save();
        this.globalCtx.font = 'bold 16px monospace';
        this.globalCtx.textAlign = 'center';
        this.globalCtx.textBaseline = 'middle';
        
        // Calculate how much of the binary effect should be visible
        const totalBinaryCount = 20 + Math.random() * 10;
        const binaryProgress = spark.binaryParticles.length / totalBinaryCount;
        
        spark.binaryParticles.forEach((particle, index) => {
            // Particles appear gradually based on their creation order
            const appearanceProgress = index / spark.binaryParticles.length;
            const shouldShow = appearanceProgress <= binaryProgress;
            
            if (shouldShow) {
                // Smooth fade with easing - particles start invisible and fade in
                const fadeInProgress = Math.min(1, (binaryProgress - appearanceProgress) * 3);
                const alpha = particle.life * particle.life * 0.4 * fadeInProgress;
                this.globalCtx.globalAlpha = alpha;
                
                // Color fades from white to transparent with spark-like colors
                const whiteIntensity = Math.floor(255 * particle.life);
                const sparkColor = spark.color || '#FFD700';
                const colorIntensity = Math.floor(255 * particle.life);
                
                // Mix white with spark color for firework effect
                this.globalCtx.fillStyle = `rgb(${whiteIntensity}, ${Math.floor(colorIntensity * 0.8)}, ${Math.floor(colorIntensity * 0.4)})`;
                this.globalCtx.shadowColor = `rgb(${whiteIntensity}, ${Math.floor(colorIntensity * 0.8)}, ${Math.floor(colorIntensity * 0.4)})`;
                this.globalCtx.shadowBlur = 6 * particle.life * fadeInProgress;
                
                this.globalCtx.fillText(particle.char, particle.x, particle.y);
            }
        });
        
        this.globalCtx.restore();
    }
    
    updateStatusText(text) {
        this.statusText = text;
        
        // Clear any existing timeout
        if (this.statusTimeout) {
            clearTimeout(this.statusTimeout);
        }
        
        // Auto-clear status after 2 seconds
        this.statusTimeout = setTimeout(() => {
            this.statusText = "Hammer Ready";
        }, 2000);
    }
    
    drawStatusText() {
        this.ctx.save();
        this.ctx.fillStyle = '#ffaa00';
        this.ctx.font = 'bold 14px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.shadowColor = '#000000';
        this.ctx.shadowBlur = 3;
        
        // Draw background rectangle
        const textWidth = this.ctx.measureText(this.statusText).width;
        const padding = 10;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(
            this.width / 2 - textWidth / 2 - padding,
            10,
            textWidth + padding * 2,
            25
        );
        
        // Draw text
        this.ctx.fillStyle = '#ffaa00';
        this.ctx.fillText(this.statusText, this.width / 2, 15);
        
        this.ctx.restore();
    }
    
    animate() {
        try {
            const currentTime = performance.now();
            
            // Frame rate limiting
            if (currentTime - this.lastFrameTime < this.frameInterval) {
                this.animationId = requestAnimationFrame(() => this.animate());
                return;
            }
            
            this.lastFrameTime = currentTime;
            
            // Validate engine state before proceeding
            if (!this.engine || !this.world) {
                console.log('Engine or world not available, stopping animation');
                return;
            }
            
            // Check if hammer should be frozen
            this.checkHammerFreeze();
            
            // Validate all constraints before engine update
            this.validateConstraints();
            
            // Additional safety check - ensure world has valid bodies
            if (!this.world.bodies || this.world.bodies.length === 0) {
                console.log('No bodies in world, stopping animation');
                return;
            }
            
            // Debug: Log world state before update (only occasionally)
            if (Math.random() < 0.01) { // Only log 1% of the time
                console.log('World bodies count:', this.world.bodies.length);
                console.log('World constraints count:', this.world.constraints.length);
            }
            
            // Check for any bodies with invalid geometry
            for (let body of this.world.bodies) {
                if (!body.vertices || body.vertices.length === 0) {
                    console.error('Body with invalid vertices:', body);
                }
            }
            
            // Check constraints for invalid references
            for (let constraint of this.world.constraints) {
                if (!constraint) {
                    console.error('Null constraint found');
                    continue;
                }
                if (constraint.bodyA && !this.world.bodies.includes(constraint.bodyA)) {
                    console.error('Constraint bodyA not in world:', constraint.bodyA);
                }
                if (constraint.bodyB && !this.world.bodies.includes(constraint.bodyB)) {
                    console.error('Constraint bodyB not in world:', constraint.bodyB);
                }
            }
            
            // Debug: Check positions before engine update (only when invalid)
            if (this.hammerHandle && this.hammerHead && 
                (!isFinite(this.hammerHandle.position.x) || !isFinite(this.hammerHandle.position.y) ||
                 !isFinite(this.hammerHead.position.x) || !isFinite(this.hammerHead.position.y))) {
                console.log('INVALID POSITIONS DETECTED - Before engine update:');
                console.log('Handle position:', this.hammerHandle.position);
                console.log('Head position:', this.hammerHead.position);
                
                // Attempt to recover from invalid positions
                this.recoverFromInvalidPositions();
            }
            
            // Update Matter.js engine with error handling
            try {
                // Reset engine timing to prevent corruption
                this.engine.timing.timestamp = performance.now();
                this.engine.timing.timeScale = 1;
                
                Matter.Engine.update(this.engine);
            } catch (engineError) {
                console.log('Engine update error:', engineError);
                console.log('Error stack:', engineError.stack);
                // If engine update fails, reset the simulation
                this.resetSimulation();
                return;
            }
            
            // Debug: Check positions after engine update (only when invalid)
            if (this.hammerHandle && this.hammerHead && 
                (!isFinite(this.hammerHandle.position.x) || !isFinite(this.hammerHandle.position.y) ||
                 !isFinite(this.hammerHead.position.x) || !isFinite(this.hammerHead.position.y))) {
                console.log('INVALID POSITIONS DETECTED - After engine update:');
                console.log('Handle position:', this.hammerHandle.position);
                console.log('Head position:', this.hammerHead.position);
            }
            
            // Check if hammer is out of bounds and reset if needed
            this.checkBounds();
            
            // Update sparks
            this.updateSparks();
            
            // Update global sparks
            this.updateGlobalSparks();
            
            // Debug: Check positions before drawing (only when invalid)
            if (this.hammerHandle && this.hammerHead && 
                (!isFinite(this.hammerHandle.position.x) || !isFinite(this.hammerHandle.position.y) ||
                 !isFinite(this.hammerHead.position.x) || !isFinite(this.hammerHead.position.y))) {
                console.log('INVALID POSITIONS DETECTED - Before drawing:');
                console.log('Handle position:', this.hammerHandle.position);
                console.log('Head position:', this.hammerHead.position);
            }
            
            // Draw everything
            this.draw();
            
            // Debug: Check positions after drawing (only when invalid)
            if (this.hammerHandle && this.hammerHead && 
                (!isFinite(this.hammerHandle.position.x) || !isFinite(this.hammerHandle.position.y) ||
                 !isFinite(this.hammerHead.position.x) || !isFinite(this.hammerHead.position.y))) {
                console.log('INVALID POSITIONS DETECTED - After drawing:');
                console.log('Handle position:', this.hammerHandle.position);
                console.log('Head position:', this.hammerHead.position);
            }
            
            // Draw global sparks
            this.drawGlobalSparks();
            
            this.animationId = requestAnimationFrame(() => this.animate());
        } catch (error) {
            console.log('Animation error:', error);
            // Stop animation and reset on any error
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            this.resetSimulation();
        }
    }
    
    
    checkHammerFreeze() {
        const currentTime = Date.now();
        
        // If not dragging and enough time has passed, freeze the hammer
        if (!this.isDragging && currentTime - this.lastInteractionTime > this.freezeDelay) {
            if (!this.hammerFrozen) {
                this.hammerFrozen = true;
                
                // Make hammer bodies static to stop all movement
                Matter.Body.setStatic(this.hammerHandle, true);
                Matter.Body.setStatic(this.hammerHead, true);
                
                // Set velocities to zero
                Matter.Body.setVelocity(this.hammerHandle, { x: 0, y: 0 });
                Matter.Body.setVelocity(this.hammerHead, { x: 0, y: 0 });
                Matter.Body.setAngularVelocity(this.hammerHandle, 0);
                Matter.Body.setAngularVelocity(this.hammerHead, 0);
                
                console.log('Hammer frozen');
            }
        }
    }
    
    checkBounds() {
        const margin = 50; // Extra margin beyond canvas bounds
        
        // Check if hammer handle is out of bounds
        const handleOut = this.hammerHandle.position.x < -margin || 
                         this.hammerHandle.position.x > this.width + margin ||
                         this.hammerHandle.position.y < -margin || 
                         this.hammerHandle.position.y > this.height + margin;
        
        // Check if hammer head is out of bounds
        const headOut = this.hammerHead.position.x < -margin || 
                       this.hammerHead.position.x > this.width + margin ||
                       this.hammerHead.position.y < -margin || 
                       this.hammerHead.position.y > this.height + margin;
        
        // If either part is out of bounds, reset the hammer
        if (handleOut || headOut) {
            console.log('Hammer out of bounds, resetting...');
            this.reset();
        }
    }
    
    reset() {
        // Clean up any existing constraint
        this.cleanupDragConstraint();
        this.isDragging = false;
        this.dragBody = null;
        
        // Reset hammer position
        Matter.Body.setPosition(this.hammerHandle, { x: this.width / 2, y: this.height / 2 - 30 });
        Matter.Body.setPosition(this.hammerHead, { x: this.width / 2 + 60, y: this.height / 2 - 30 });
        Matter.Body.setVelocity(this.hammerHandle, { x: 0, y: 0 });
        Matter.Body.setVelocity(this.hammerHead, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(this.hammerHandle, 0);
        Matter.Body.setAngularVelocity(this.hammerHead, 0);
        
        // Clear sparks
        this.sparks = [];
    }
    
    resetSimulation() {
        try {
            console.log('Resetting simulation...');
            
            // Stop animation first
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            
            // Clean up drag constraint
            this.cleanupDragConstraint();
            this.isDragging = false;
            this.dragBody = null;
            
            // Completely destroy and recreate the engine
            if (this.engine) {
                try {
                    Matter.Engine.clear(this.engine);
                } catch (e) {
                    console.log('Error clearing engine:', e);
                }
            }
            
            // Create a completely new engine
            this.engine = Matter.Engine.create();
            this.world = this.engine.world;
            this.engine.world.gravity.y = 0.8;
            
            // Clear all references
            this.hammerHandle = null;
            this.hammerHead = null;
            this.hammerConstraint = null;
            this.anvil = null;
            this.topWall = null;
            this.bottomWall = null;
            this.leftWall = null;
            this.rightWall = null;
            
            // Clear canvas sparks but keep global sparks
            this.sparks = [];
            
            // Recreate everything
            this.createAnvil();
            this.createHammer();
            this.createWalls();
            this.createMouseConstraint();
            
            // Reset state
            this.hammerFrozen = true;
            this.lastInteractionTime = Date.now();
            
            // Restart animation after reset
            setTimeout(() => {
                this.startAnimation();
            }, 100);
            
            console.log('Simulation reset successfully');
        } catch (error) {
            console.log('Error resetting simulation:', error);
        }
    }
    
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        Matter.Engine.clear(this.engine);
        
        // Clean up global canvas
        if (this.globalCanvas && this.globalCanvas.parentNode) {
            this.globalCanvas.parentNode.removeChild(this.globalCanvas);
        }
    }
}

// Initialize anvil simulation when page loads
let anvilSim = null;

document.addEventListener('DOMContentLoaded', () => {
    // Wait for Matter.js to load with a retry mechanism
    const initSimulation = () => {
        if (typeof Matter === 'undefined') {
            console.log('Matter.js not loaded yet, retrying in 100ms...');
            setTimeout(initSimulation, 100);
            return;
        }
        
        console.log('Matter.js loaded successfully, version:', Matter.version);
        
        const canvas = document.getElementById('anvilCanvas');
        if (canvas) {
            console.log('Canvas found, initializing simulation');
            anvilSim = new AnvilSimulation(canvas);
        } else {
            console.error('Canvas not found!');
        }
    };
    
    initSimulation();
});

// Reset function for the button
function resetAnvil() {
    if (anvilSim) {
        anvilSim.reset();
    }
}

// Add scroll-triggered animations for project cards
function animateProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    projectCards.forEach(card => {
        // Don't hide cards initially
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Initialize project card animations
document.addEventListener('DOMContentLoaded', animateProjectCards);

// Add loading animation - ensure content is visible
function addLoadingAnimation() {
    // Don't hide content initially
    document.body.classList.add('loaded');
    
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
}

// Initialize loading animation
document.addEventListener('DOMContentLoaded', addLoadingAnimation);

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu on escape
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add performance optimization
function optimizePerformance() {
    // Lazy load images when they come into view
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);

// Add smooth reveal animation for all sections - ensure content is visible
function addRevealAnimation() {
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        // Don't hide sections initially
        section.classList.add('loaded');
        sectionObserver.observe(section);
    });
}

// Initialize reveal animations
document.addEventListener('DOMContentLoaded', addRevealAnimation);
