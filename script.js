document.addEventListener('DOMContentLoaded', () => {
    // --- Video Hover Logic ---
    const cards = document.querySelectorAll('.card');

    // Intersection Observer for Lazy Loading
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const video = card.querySelector('video');
                // Check if video exists
                if (video) {
                    const videoSrc = video.getAttribute('data-src');
                    if (videoSrc && !video.src) {
                        video.src = videoSrc;
                        video.load();
                    }
                }
                observer.unobserve(card);
            }
        });
    }, {
        rootMargin: '200px',
        threshold: 0.1
    });

    cards.forEach(card => {
        lazyLoadObserver.observe(card);
        
        const video = card.querySelector('video');
        
        // Only attach listeners if the card has a video
        if (video) {
            card.addEventListener('mouseenter', async () => {
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                
                if (video.readyState >= 2 || video.networkState >= 2) { 
                    try {
                        await video.play();
                        card.classList.add('is-playing');
                    } catch (err) {
                        console.log('Autoplay prevented or interrupted', err);
                    }
                } else {
                    video.play().then(() => {
                        card.classList.add('is-playing');
                    }).catch(err => console.error(err));
                }
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('is-playing');
                video.pause();
            });
        }
    });

    // --- Text Carousel Logic ---
    const carouselItems = document.querySelectorAll('.carousel-item');
    if (carouselItems.length > 0) {
        let currentIndex = 0;
        setInterval(() => {
            // Remove active class from current
            carouselItems[currentIndex].classList.remove('active');
            
            // Move to next
            currentIndex = (currentIndex + 1) % carouselItems.length;
            
            // Add active class to next
            carouselItems[currentIndex].classList.add('active');
        }, 3000); // Change every 3 seconds
    }
});
