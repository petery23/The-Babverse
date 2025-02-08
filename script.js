document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const monthTitle = document.getElementById('monthTitle');
    const images = document.querySelectorAll('.slider img');
    
    let currentIndex = 0;

    function updateSlide() {
        const currentImage = images[currentIndex];
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        monthTitle.textContent = `Month ${currentImage.dataset.month}`;
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
    });
});