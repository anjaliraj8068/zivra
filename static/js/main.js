/**
 * Zivra Landing Page Interactions
 * 
 * Includes:
 * 1. Scroll-responsive Navbar Glassmorphism Effect
 * 2. Interactive FAQ Accordion
 * 3. Premium Testimonial Slider / Carousel
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initFAQAccordion();
  initTestimonialSlider();
});

/**
 * 1. Navbar Scroll Effect
 * Toggles a class on scroll to add styling/shadows once scrolled past the hero threshold.
 */
function initNavbarScroll() {
  const header = document.querySelector('.header-main');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Run on load and add listener
  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

/**
 * 2. FAQ Accordion
 * Toggles answers with height calculations to support fluid transitions.
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for a clean accordion effect
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('active');
        // Calculate content height for smooth slide down
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
}

/**
 * 3. Testimonial Slider
 * A smooth sliding carousel with dots and arrow controls.
 */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const nextBtn = document.querySelector('.control-btn.next');
  const prevBtn = document.querySelector('.control-btn.prev');
  const dotsContainer = document.querySelector('.testimonial-dots');
  
  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const slideCount = slides.length;

  // Create slide indicator dots dynamically
  dotsContainer.innerHTML = '';
  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll('.dot');

  // Go to a specific slide index
  const goToSlide = (index) => {
    if (index < 0 || index >= slideCount) return;
    
    currentIndex = index;
    
    // Shift track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Sync dots active state
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  // Next / Prev button events
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % slideCount;
      goToSlide(nextIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const prevIndex = (currentIndex - 1 + slideCount) % slideCount;
      goToSlide(prevIndex);
    });
  }

  // Auto-play every 7 seconds
  let autoPlayTimer = setInterval(() => {
    const nextIndex = (currentIndex + 1) % slideCount;
    goToSlide(nextIndex);
  }, 7000);

  // Reset timer on manual click to avoid immediate jump
  const resetAutoPlay = () => {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slideCount;
      goToSlide(nextIndex);
    }, 7000);
  };

  [nextBtn, prevBtn, ...dots].forEach(elem => {
    if (elem) elem.addEventListener('click', resetAutoPlay);
  });
}
