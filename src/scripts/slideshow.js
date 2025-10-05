/**
 * Slideshow functionality for blocks with multiple images
 */

class BlockSlideshow {
  constructor(element) {
    this.element = element;
    this.images = [element.src]; // Start with current image

    try {
      const slideshowData = element.dataset.slideshow;
      if (slideshowData) {
        const additionalImages = JSON.parse(slideshowData);
        this.images = this.images.concat(additionalImages);
      }
    } catch (error) {
      console.error('Error parsing slideshow data:', error);
    }

    this.currentIndex = 0;

    if (this.images.length > 1) {
      this.start();
    }
  }

  start() {
    // Cycle through images every 3 seconds
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.element.src = this.images[this.currentIndex];
    }, 3000);
  }
}

// Initialize all slideshows on page load
document.addEventListener('DOMContentLoaded', () => {
  const slideshows = document.querySelectorAll('.block__image--slideshow');
  slideshows.forEach(el => new BlockSlideshow(el));

  console.log(`Initialized ${slideshows.length} slideshows`);
});
