document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const monthTitle = document.getElementById('monthTitle');
    const images = document.querySelectorAll('.slider img');
    
    let currentIndex = 0;
    let autoScrollInterval;

    function updateSlide() {
        const currentImage = images[currentIndex];
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        const month = currentImage.dataset.month;
        monthTitle.textContent = formatMonthTitle(month);
    }

    function formatMonthTitle(month) {
        const year = Math.floor((month - 1) / 12);
        const monthInYear = (month - 1) % 12 + 1;
        const monthText = monthInYear === 1 ? 'Month' : 'Months';
        if (year === 0) {
            return `${monthInYear} ${monthText}`;
        } else {
            const yearText = year === 1 ? 'Year' : 'Years';
            return `${year} ${yearText} ${monthInYear} ${monthText}`;
        }
    }

    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            if (currentIndex < images.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlide();
        }, 3000); // Change slide every 3 seconds
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    nextBtn.addEventListener('click', () => {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            updateSlide();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlide();
        }
    });

    // Enable touch swiping
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoScroll();
    });

    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50 && currentIndex < images.length - 1) {
            currentIndex++;
            updateSlide();
        } else if (touchEndX - touchStartX > 50 && currentIndex > 0) {
            currentIndex--;
            updateSlide();
        }
        startAutoScroll();
    });

    document.getElementById('monthSelect').addEventListener('change', function() {
        const selectedMonth = this.value;
        const galleryGrid = document.getElementById('galleryGrid');
        galleryGrid.innerHTML = ''; // Clear existing images

        if (selectedMonth) {
            const images = document.querySelectorAll(`.slider img[data-month="${selectedMonth}"]`);
            images.forEach(img => {
                const clone = img.cloneNode(true);
                clone.onclick = () => {
                    // Optional: add click behavior to view full size
                    window.open(clone.src, '_blank');
                };
                galleryGrid.appendChild(clone);
            });
        }
    });

    startAutoScroll();
});