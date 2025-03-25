class SmoothScroller {
  constructor() {
    this.headerHeight = document.querySelector('header')?.offsetHeight || 80;
    this.scrollDuration = 800;
    this.easingFunction = this.easeInOutQuad;
    this.init();
  }

  init() {
    // Handle initial page load with hash
    if (window.location.hash) {
      this.scrollToTarget(window.location.hash);
    }

    // Set up event listeners for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      // Skip links that don't point to valid elements
      if (anchor.hash && anchor.hash !== '#') {
        anchor.addEventListener('click', this.handleClick.bind(this));
        
        // Add aria-label if none exists
        if (!anchor.hasAttribute('aria-label')) {
          const targetId = anchor.getAttribute('href').slice(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            anchor.setAttribute('aria-label', `Scroll to ${targetElement.innerText || targetId}`);
          }
        }
      }
    });

    // Handle browser back/forward navigation
    window.addEventListener('hashchange', () => {
      if (window.location.hash) {
        this.scrollToTarget(window.location.hash);
      }
    });
  }

  handleClick(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId && targetId !== '#') {
      history.pushState(null, null, targetId);
      this.scrollToTarget(targetId);
    }
  }

  scrollToTarget(targetId) {
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    const targetPosition = this.getTargetPosition(targetElement);
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = this.easingFunction(
        timeElapsed,
        startPosition,
        distance,
        this.scrollDuration
      );
      window.scrollTo(0, run);
      if (timeElapsed < this.scrollDuration) {
        requestAnimationFrame(animation);
      } else {
        // Ensure final position is accurate
        window.scrollTo(0, targetPosition);
        // Focus the target for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
      }
    };

    requestAnimationFrame(animation);
  }

  getTargetPosition(element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - this.headerHeight;
    return Math.max(offsetPosition, 0); // Don't scroll above the page
  }

  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SmoothScroller();
});