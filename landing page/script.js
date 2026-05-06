/**
 * StudyFlow AI - Main Interactions Script
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Navbar on Scroll
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navActions = document.querySelector('.nav-actions');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navActions.classList.toggle('active');
            
            // Toggle hamburger animation (optional)
            const bars = hamburger.querySelectorAll('.bar');
            if (navLinks.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking a link
    const mobileLinks = navLinks.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                navActions.classList.remove('active');
                const bars = hamburger.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    });

    // 3. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Stop observing once it has faded in
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedSections = document.querySelectorAll('.fade-in-section');
    animatedSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 4. FAQ Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const accordionContent = accordionItem.querySelector('.accordion-content');
            
            // Toggle active class
            const isActive = accordionItem.classList.contains('active');
            
            // Close all other accordions
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.accordion-content').style.maxHeight = null;
            });

            // If it wasn't active, open it
            if (!isActive) {
                accordionItem.classList.add('active');
                accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
            }
        });
    });

    // 5. Pricing Toggle Logic
    const billingSwitch = document.getElementById('billing-switch');
    const monthlyLabel = document.getElementById('monthly-label');
    const yearlyLabel = document.getElementById('yearly-label');
    const amounts = document.querySelectorAll('.pricing-card .amount');

    if (billingSwitch) {
        billingSwitch.addEventListener('change', (e) => {
            const isYearly = e.target.checked;
            
            if (isYearly) {
                monthlyLabel.classList.remove('active');
                yearlyLabel.classList.add('active');
            } else {
                monthlyLabel.classList.add('active');
                yearlyLabel.classList.remove('active');
            }

            // Animate price change
            amounts.forEach(amount => {
                // Fade out
                amount.style.opacity = '0';
                
                setTimeout(() => {
                    if (isYearly) {
                        amount.textContent = amount.getAttribute('data-yearly');
                    } else {
                        amount.textContent = amount.getAttribute('data-monthly');
                    }
                    // Fade in
                    amount.style.opacity = '1';
                }, 200); // Wait for fade out
            });
        });
    }
    
    // Add simple CSS transition for smooth price changes via JS
    amounts.forEach(amount => {
        amount.style.transition = 'opacity 0.2s ease';
    });
});
