
import confetti from 'canvas-confetti';

// Function to trigger confetti effect
export const triggerConfetti = (options?: any) => {
  const defaults = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  };
  
  confetti({
    ...defaults,
    ...options
  });
};

// Function to make it rain confetti from the top
export const makeItRain = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0 },
    zIndex: 2000,
  };
  
  function fire(particleRatio: number, opts: any) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }
  
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  
  fire(0.2, {
    spread: 60,
  });
  
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

// Function to create fire effect (animated particles rising from bottom)
export const triggerFireEffect = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Use different colors for fire effect (red, orange, yellow)
    confetti({
      ...defaults,
      particleCount,
      origin: { x: 0.3, y: 1 },
      colors: ['#ff0000', '#ff7700', '#ffcc00']
    });
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: 0.7, y: 1 },
      colors: ['#ff0000', '#ff7700', '#ffcc00']
    });
    
  }, 250);
};

// Function for admin flourish (subtle effect when admin performs actions)
export const adminFlourish = (element?: HTMLElement) => {
  const origin = element 
    ? { x: element.getBoundingClientRect().left / window.innerWidth, y: element.getBoundingClientRect().top / window.innerHeight }
    : { x: 0.5, y: 0.5 };
  
  confetti({
    particleCount: 30,
    spread: 50,
    origin,
    colors: ['#8a2be2', '#4b0082', '#7b68ee'], // Purple-ish colors for admin
    zIndex: 2000,
  });
};

// Starfall animation for special announcements
export const triggerStarfall = () => {
  const end = Date.now() + 3000;
  
  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FFD700', '#FFA500', '#FFFFFF'],
    });
    
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FFD700', '#FFA500', '#FFFFFF'],
    });
    
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};

// Matrix-like digital rain effect (green particles falling from top)
export const digitalRain = () => {
  const duration = 4 * 1000;
  const end = Date.now() + duration;
  
  (function frame() {
    confetti({
      particleCount: 2,
      startVelocity: 30,
      ticks: 200,
      origin: { x: Math.random(), y: -0.1 },
      gravity: 0.8,
      scalar: 0.8,
      colors: ['#00ff00', '#39ff14', '#32cd32'],
      shapes: ['square']
    });
    
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};
