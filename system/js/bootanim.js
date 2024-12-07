document.addEventListener('DOMContentLoaded', () => {
    // Simulate boot loading time
    setTimeout(() => {
        const bootAnimation = document.getElementById('boot-animation');
        
        // Fade out the boot animation
        bootAnimation.style.opacity = '0';
        
        // Remove the boot animation after fade out
        setTimeout(() => {
            bootAnimation.style.display = 'none';
            
            // Show desktop or login screen
            document.getElementById('desktop').style.display = 'block'; // or show login screen
        }, 500); // Match this time to the transition duration
    }, 5000); // Boot animation duration (5 seconds)
});
