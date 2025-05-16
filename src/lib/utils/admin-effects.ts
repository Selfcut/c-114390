
import confetti from 'canvas-confetti';
import { toast } from '@/hooks/use-toast';

// Basic confetti celebration
export const triggerConfetti = () => {
  const duration = 3000;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: any = setInterval(() => {
    const timeLeft = duration - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Random colors
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#ff0000', '#00ff00', '#0000ff'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#ffff00', '#ff00ff', '#00ffff'],
    });
  }, 250);

  toast({
    title: "Confetti Time!",
    description: "Celebrating with colorful confetti!",
    variant: "default",
  });
};

// Make it rain confetti from the top
export const makeItRain = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0 },
    zIndex: 1000,
  };

  const fire = (particleRatio: number, opts: any) => {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    }));
  };

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    origin: { x: 0.2 }
  });
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    origin: { x: 0.8 }
  });
  fire(0.2, {
    spread: 60,
    decay: 0.8,
    scalar: 0.8
  });
  fire(0.3, {
    spread: 100,
    decay: 0.9,
    scalar: 0.9
  });

  toast({
    title: "It's Raining Confetti!",
    description: "A colorful shower from above!",
    variant: "default",
  });
};

// Fire effect from bottom
export const triggerFireEffect = () => {
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 100,
    zIndex: 0,
    particleCount: 40,
    origin: { y: 1 }
  };

  const interval: any = setInterval(() => {
    confetti({
      ...defaults,
      angle: 120,
      origin: { x: 0.1, y: 0.9 },
      colors: ['#ff4500', '#ff8c00', '#ffd700']
    });
    confetti({
      ...defaults,
      angle: 60,
      origin: { x: 0.9, y: 0.9 },
      colors: ['#ff4500', '#ff8c00', '#ffd700']
    });
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
  }, 2000);

  toast({
    title: "Fire Effect Activated!",
    description: "The screen is heating up!",
    variant: "destructive",
  });
};

// Admin flourish animation
export const adminFlourish = (element: HTMLElement) => {
  // Create a ripple effect
  const ripple = document.createElement('div');
  ripple.className = 'admin-ripple';
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background-color: rgba(147, 51, 234, 0.2);
    transform: scale(0);
    animation: ripple 0.8s linear;
    z-index: 9999;
  `;

  // Create a style element if it doesn't exist yet
  if (!document.getElementById('admin-effects-style')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'admin-effects-style';
    styleEl.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      .admin-float {
        animation: float 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(styleEl);
  }

  // Position the ripple correctly
  const rect = element.getBoundingClientRect();
  ripple.style.width = `${rect.width * 0.8}px`;
  ripple.style.height = `${rect.width * 0.8}px`;
  ripple.style.left = `${rect.width / 2 - rect.width * 0.4}px`;
  ripple.style.top = `${rect.height / 2 - rect.width * 0.4}px`;

  // Relative position for the ripple
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  
  // Add the ripple to the element
  element.appendChild(ripple);

  // Add float animation to the button
  element.classList.add('admin-float');
  
  // Clean up after animation
  setTimeout(() => {
    if (element.contains(ripple)) {
      element.removeChild(ripple);
    }
    setTimeout(() => {
      element.classList.remove('admin-float');
    }, 2000);
  }, 800);

  toast({
    title: "Admin Powers Activated",
    description: "Your administrative presence has been flourished!",
    variant: "default",
  });
};

// Starfall effect
export const triggerStarfall = () => {
  const defaults = {
    shapes: ['star'],
    ticks: 100,
    zIndex: 1000,
    scalar: 1.2,
    disableForReducedMotion: true
  };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 10,
        spread: 80,
        origin: { x: randomInRange(0.2, 0.8), y: randomInRange(0, 0.2) },
        colors: ['#FFD700', '#FFC0CB', '#ADD8E6', '#90EE90', '#FFFFFF']
      });
    }, i * 300);
  }

  toast({
    title: "Starfall",
    description: "Stars are falling all around!",
    variant: "default",
  });
};

// Matrix-style digital rain
export const digitalRain = () => {
  // Create a canvas for the digital rain
  const canvas = document.createElement('canvas');
  canvas.id = 'digital-rain';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    pointer-events: none;
    opacity: 0.8;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;

  // Set canvas size to window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Characters to use
  const chars = "01";
  
  // Array to store drop positions
  const columns = Math.floor(canvas.width / 15);
  const drops: number[] = [];

  // Initialize drops
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }

  // Animation loop
  const draw = () => {
    // Semi-transparent black to create fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Green text
    ctx.fillStyle = '#0F0';
    ctx.font = '15px monospace';

    // Loop through drops
    for (let i = 0; i < drops.length; i++) {
      // Random character
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      
      // x = i * 15, y = drops[i] * 15
      ctx.fillText(text, i * 15, drops[i] * 15);

      // Send drop back to top randomly after it's below screen
      if (drops[i] * 15 > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      // Increment drop position
      drops[i]++;
    }
  };

  // Run animation
  const interval = setInterval(draw, 35);

  // Clear animation after 5 seconds
  setTimeout(() => {
    clearInterval(interval);
    if (document.body.contains(canvas)) {
      document.body.removeChild(canvas);
    }
  }, 5000);

  toast({
    title: "Digital Rain",
    description: "Welcome to the Matrix!",
    variant: "default",
  });
};

// Snow effect
export const triggerSnowfall = () => {
  const defaults = { startVelocity: 3, spread: 360, ticks: 200, zIndex: 0 };
  const snowCount = 100;

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: any = setInterval(() => {
    const particleCount = 1;
    
    // Create snow across the top of the screen
    for (let i = 0; i < 10; i++) {
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0, 1), y: -0.1 },
        colors: ['#ffffff'],
        shapes: ['circle'],
        scalar: randomInRange(0.4, 1)
      });
    }
  }, 50);

  setTimeout(() => {
    clearInterval(interval);
  }, 5000);

  toast({
    title: "Let It Snow!",
    description: "A winter wonderland appears!",
    variant: "default",
  });
};

// Sparkle effect
export const sparkleElement = (element: HTMLElement) => {
  // Add sparkles around the element
  const count = 15;
  const defaults = {
    startVelocity: 15,
    spread: 360,
    ticks: 50,
    zIndex: 1000,
    shapes: ['star'],
    colors: ['#FFD700', '#FFFFFF', '#87CEFA']
  };

  // Get the position of the element
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Normalize the position to confetti's 0-1 origin system
  const originX = centerX / window.innerWidth;
  const originY = centerY / window.innerHeight;
  
  // Add sparkles around the element
  confetti({
    ...defaults,
    particleCount: count,
    origin: { x: originX, y: originY }
  });

  // Make the element "shine"
  element.style.transition = 'all 0.5s ease';
  element.style.boxShadow = '0 0 15px #FFD700';
  
  setTimeout(() => {
    element.style.boxShadow = '';
  }, 1000);
};

// Glitch effect
export const glitchScreen = () => {
  // Create overlay for the glitch effect
  const overlay = document.createElement('div');
  overlay.id = 'glitch-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    background: transparent;
  `;
  document.body.appendChild(overlay);

  // Create style for animations
  if (!document.getElementById('glitch-style')) {
    const style = document.createElement('style');
    style.id = 'glitch-style';
    style.textContent = `
      @keyframes glitch {
        0% { transform: translate(0); filter: hue-rotate(0deg); }
        10% { transform: translate(-5px, 0); filter: hue-rotate(90deg); }
        20% { transform: translate(5px, 0); filter: hue-rotate(180deg); }
        30% { transform: translate(0, -5px); filter: hue-rotate(270deg); }
        40% { transform: translate(0, 5px); filter: hue-rotate(360deg); }
        50% { transform: translate(-2px, 2px); filter: hue-rotate(180deg); }
        60% { transform: translate(2px, -2px); filter: hue-rotate(270deg); }
        70% { transform: translate(-2px, -2px); filter: hue-rotate(90deg); }
        80% { transform: translate(2px, 2px); filter: hue-rotate(0deg); }
        90% { transform: translate(0); filter: hue-rotate(180deg); }
        100% { transform: translate(0); filter: hue-rotate(0deg); }
      }
      .glitch-effect {
        animation: glitch 0.3s infinite;
      }
    `;
    document.head.appendChild(style);
  }

  // Add glitch effect to the screen
  document.body.classList.add('glitch-effect');

  // Take a screenshot of the current screen
  html2canvas(document.body, { 
    allowTaint: true,
    foreignObjectRendering: true,
    scale: 1
  }).then(canvas => {
    // Add the screenshot to the overlay
    overlay.appendChild(canvas);
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.classList.add('glitch-effect');
    
    // Remove the effect after a short time
    setTimeout(() => {
      document.body.classList.remove('glitch-effect');
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, 2000);
  }).catch(() => {
    // If html2canvas fails, just remove the effect
    document.body.classList.remove('glitch-effect');
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  });

  toast({
    title: "System Glitch",
    description: "Reality is temporarily unstable!",
    variant: "destructive",
  });
};

// Rainbow Wave effect on text
export const rainbowText = (element: HTMLElement) => {
  // Create style for rainbow text
  if (!document.getElementById('rainbow-style')) {
    const style = document.createElement('style');
    style.id = 'rainbow-style';
    style.textContent = `
      @keyframes rainbow {
        0% { color: #ff0000; }
        16.7% { color: #ffff00; }
        33.3% { color: #00ff00; }
        50% { color: #00ffff; }
        66.7% { color: #0000ff; }
        83.3% { color: #ff00ff; }
        100% { color: #ff0000; }
      }
      .rainbow-text {
        animation: rainbow 4s linear infinite;
      }
    `;
    document.head.appendChild(style);
  }

  // Save original text content and split into letters
  const text = element.innerText;
  element.innerHTML = '';

  // Create span for each letter with staggered animation
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const span = document.createElement('span');
    span.className = 'rainbow-text';
    span.style.animationDelay = `${i * 0.1}s`;
    span.textContent = char;
    element.appendChild(span);
  }

  // Reset after a while
  setTimeout(() => {
    element.innerHTML = text;
  }, 5000);

  toast({
    title: "Rainbow Text",
    description: "Text with a rainbow effect!",
    variant: "default",
  });
};
