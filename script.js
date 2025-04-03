document.addEventListener('DOMContentLoaded', () => {
    // --- Selectors ---
    const slider = document.querySelector('.slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const monthTitle = document.getElementById('monthTitle');
    const images = document.querySelectorAll('.slider img'); // All images in the slider
    const monthSelect = document.getElementById('monthSelect');
    const galleryGrid = document.getElementById('galleryGrid');
    const fallingPhotosContainer = document.getElementById('fallingPhotosContainer');
    const sliderContainer = document.querySelector('.slider-container'); // Get slider container for scrollIntoView

    // --- State Variables ---
    let currentIndex = 0;
    let autoScrollInterval;

    // --- Falling Photos Logic ---
    const month14ImageSources = Array.from(images)
        .filter(img => img.dataset.month === "14")
        .map(img => img.src);

    const fallingIntervalTime = 800; // Milliseconds between new photos appearing

    function createFallingPhoto() {
        if (month14ImageSources.length === 0 || !fallingPhotosContainer) return;

        const photo = document.createElement('img');
        photo.classList.add('falling-photo');
        const randomSrc = month14ImageSources[Math.floor(Math.random() * month14ImageSources.length)];
        photo.src = randomSrc;
        photo.alt = "Falling memory";

        const startLeft = Math.random() * 95;
        const duration = Math.random() * 5 + 8;
        const rotation = Math.random() * 60 - 30;

        photo.style.left = `${startLeft}vw`;
        photo.style.animationDuration = `${duration}s`;
        photo.style.transform = `rotate(${rotation}deg)`;

        fallingPhotosContainer.appendChild(photo);

        setTimeout(() => {
            photo.remove();
        }, duration * 1000);
    }

    if (fallingPhotosContainer) {
       setInterval(createFallingPhoto, fallingIntervalTime);
    }
    // --- End Falling Photos Logic ---


    // --- Slider Core Functions ---
    function updateSlide() {
        if (!images.length) return;
        const currentImage = images[currentIndex];
        if (!currentImage) return;

        slider.style.transform = `translateX(-${currentIndex * 100}%)`;

        const month = currentImage.dataset.month;
        monthTitle.textContent = formatMonthTitle(month);
    }

    function formatMonthTitle(month) {
        const monthNum = parseInt(month, 10);
        if (isNaN(monthNum) || monthNum < 1) return "Select Month";

        const year = Math.floor((monthNum - 1) / 12);
        const monthInYear = (monthNum - 1) % 12 + 1;
        let title = "";

        if (monthNum >= 12) { // Special handling for 1 year or more
             const exactYear = Math.floor((monthNum-1) / 12);
             const remainingMonths = monthNum % 12;
             title = `${exactYear} ${exactYear === 1 ? 'Year' : 'Years'}`;
             if (remainingMonths > 0) {
                 title += ` ${remainingMonths} ${remainingMonths === 1 ? 'Month' : 'Months'}`;
             }
        } else { // Less than 1 year
            title = `${monthInYear} ${monthInYear === 1 ? 'Month' : 'Months'}`;
        }

        return title || "Anniversary";
    }


    function startAutoScroll() {
        clearInterval(autoScrollInterval);
        if (images.length > 1) {
            autoScrollInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                updateSlide();
            }, 3000);
        }
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    // --- Event Listeners ---

    // Slider Navigation Buttons
    nextBtn.addEventListener('click', () => {
        if (images.length > 0) {
            currentIndex = (currentIndex + 1) % images.length;
            updateSlide();
            stopAutoScroll();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (images.length > 0) {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateSlide();
            stopAutoScroll();
        }
    });

    // Touch Swiping for Slider
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoScroll();
    }, { passive: true });

    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });

    function handleSwipeGesture() {
         if (images.length === 0) return;
        const difference = touchStartX - touchEndX;
        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                 currentIndex = (currentIndex + 1) % images.length;
            } else {
                 currentIndex = (currentIndex - 1 + images.length) % images.length;
            }
            updateSlide();
        }
    }

    // Month Gallery Population and Click Handling (MODIFIED PART)
    monthSelect.addEventListener('change', function() {
        const selectedMonth = this.value;
        galleryGrid.innerHTML = ''; // Clear existing images

        if (selectedMonth) {
            // Find all images in the slider matching the selected month
            const monthImagesInSlider = document.querySelectorAll(`.slider img[data-month="${selectedMonth}"]`);

            if (monthImagesInSlider.length > 0) {
                monthImagesInSlider.forEach(img => {
                    const clone = img.cloneNode(true); // Clone the image for the grid
                    clone.style.transform = ''; // Remove slider-specific styles if any
                    clone.style.minWidth = '';

                    // *** NEW Click Handler ***
                    clone.onclick = () => {
                        const clickedSrc = clone.src;
                        // Find the index of the image with the matching source in the *original* slider NodeList
                        const sliderImagesArray = Array.from(images);
                        const foundIndex = sliderImagesArray.findIndex(sliderImg => sliderImg.src === clickedSrc);

                        if (foundIndex !== -1) {
                            stopAutoScroll(); // Stop autoscroll on manual interaction
                            currentIndex = foundIndex; // Set the slider to the clicked image's index
                            updateSlide(); // Update the slider display

                            // Scroll the page smoothly up to the slider for better UX
                            if (sliderContainer) {
                                sliderContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                        } else {
                            // This shouldn't happen if the clone comes from the slider, but good practice
                            console.warn("Clicked image source not found in the main slider:", clickedSrc);
                        }
                    };
                    // *** End NEW Click Handler ***

                    galleryGrid.appendChild(clone); // Add the clickable clone to the grid
                });
            } else {
                galleryGrid.innerHTML = '<p style="color: #4E342E;">No photos for this month yet!</p>';
            }
        }
    });

    // --- Initial Setup ---
    if (images.length > 0) {
        updateSlide();
        startAutoScroll();
    } else {
        monthTitle.textContent = "Happy Anniversary!";
        if(slider) slider.innerHTML = '<p style="text-align:center; width:100%; padding: 20px; color: #4E342E;">Add images to the slider!</p>';
    }
});