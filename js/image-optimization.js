/**
 * ArcVantage Design Studios - Image Optimization Utilities
 * Handles image compression, lazy loading, and responsive image delivery
 */

class ImageOptimizer {
    constructor() {
        this.supportedFormats = this.checkSupportedFormats();
        this.lazyLoadObserver = null;
        this.init();
    }

    /**
     * Initialize image optimization
     */
    init() {
        this.setupLazyLoading();
        this.optimizeExistingImages();
        this.setupResponsiveImages();
    }

    /**
     * Check which modern image formats are supported
     * @returns {Object} Supported formats object
     */
    checkSupportedFormats() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        
        return {
            webp: canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0,
            avif: canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
        };
    }

    /**
     * Setup lazy loading with Intersection Observer
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.lazyLoadObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.lazyLoadObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe all lazy load images
            document.querySelectorAll('[data-src]').forEach(img => {
                this.lazyLoadObserver.observe(img);
            });
        }
    }

    /**
     * Load image with optimization
     * @param {HTMLImageElement} img - Image element to load
     */
    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        // Create optimized source URL
        const optimizedSrc = this.getOptimizedImageUrl(src);
        
        // Show loading state
        img.classList.add('loading');
        
        // Create new image to preload
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            img.src = optimizedSrc;
            img.classList.remove('loading');
            img.classList.add('loaded');
            
            // Hide placeholder if exists
            const placeholder = img.parentElement.querySelector('.image-placeholder');
            if (placeholder) {
                placeholder.style.opacity = '0';
                setTimeout(() => {
                    placeholder.style.display = 'none';
                }, 300);
            }
        };
        
        imageLoader.onerror = () => {
            img.classList.remove('loading');
            img.classList.add('error');
            img.src = this.getFallbackImage(src);
        };
        
        imageLoader.src = optimizedSrc;
    }

    /**
     * Get optimized image URL based on supported formats and device
     * @param {string} originalSrc - Original image source
     * @returns {string} Optimized image URL
     */
    getOptimizedImageUrl(originalSrc) {
        // For now, return original URL
        // In a real implementation, you would:
        // 1. Check device pixel ratio
        // 2. Determine optimal size based on container
        // 3. Return WebP/AVIF version if supported
        // 4. Add compression parameters
        
        const devicePixelRatio = window.devicePixelRatio || 1;
        const isHighDPI = devicePixelRatio > 1;
        
        // Simple optimization: add quality parameter for high DPI displays
        if (isHighDPI && originalSrc.includes('.jpg')) {
            return originalSrc; // In real implementation, add ?quality=85&dpr=2
        }
        
        return originalSrc;
    }

    /**
     * Get fallback image for failed loads
     * @param {string} originalSrc - Original image source
     * @returns {string} Fallback image URL
     */
    getFallbackImage(originalSrc) {
        if (originalSrc.includes('projects/')) {
            return 'images/projects/placeholder.jpg';
        }
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZmFmYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM3MTgwOTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
    }

    /**
     * Optimize existing images on the page
     */
    optimizeExistingImages() {
        const images = document.querySelectorAll('img:not([data-src])');
        
        images.forEach(img => {
            // Add loading attribute if not present
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add decoding attribute for better performance
            img.setAttribute('decoding', 'async');
            
            // Add error handling
            img.addEventListener('error', () => {
                img.src = this.getFallbackImage(img.src);
            });
        });
    }

    /**
     * Setup responsive images based on container size
     */
    setupResponsiveImages() {
        const responsiveImages = document.querySelectorAll('.responsive-image');
        
        if ('ResizeObserver' in window) {
            const resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    const img = entry.target;
                    const containerWidth = entry.contentRect.width;
                    
                    // Update image size based on container
                    this.updateImageSize(img, containerWidth);
                });
            });
            
            responsiveImages.forEach(img => {
                resizeObserver.observe(img.parentElement);
            });
        }
    }

    /**
     * Update image size based on container width
     * @param {HTMLImageElement} img - Image element
     * @param {number} containerWidth - Container width in pixels
     */
    updateImageSize(img, containerWidth) {
        // Determine optimal image size
        let targetWidth = containerWidth;
        
        if (containerWidth <= 480) {
            targetWidth = 480;
        } else if (containerWidth <= 768) {
            targetWidth = 768;
        } else if (containerWidth <= 1024) {
            targetWidth = 1024;
        } else {
            targetWidth = 1200;
        }
        
        // In a real implementation, you would update the src with size parameters
        // For now, we just ensure the image is properly sized
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
    }

    /**
     * Preload critical images
     * @param {Array} imageSources - Array of image URLs to preload
     */
    preloadImages(imageSources) {
        imageSources.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    /**
     * Compress image client-side (for user uploads)
     * @param {File} file - Image file to compress
     * @param {number} quality - Compression quality (0-1)
     * @returns {Promise<Blob>} Compressed image blob
     */
    compressImage(file, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calculate new dimensions
                const maxWidth = 1200;
                const maxHeight = 800;
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }
}

// Initialize image optimizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.imageOptimizer = new ImageOptimizer();
    
    // Preload critical images
    const criticalImages = [
        'images/hero/hero-background.jpg',
        'images/projects/project1-main.jpg',
        'images/projects/project2-main.jpg'
    ];
    
    window.imageOptimizer.preloadImages(criticalImages);
});