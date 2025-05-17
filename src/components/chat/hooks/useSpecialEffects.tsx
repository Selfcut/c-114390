
import confetti from 'canvas-confetti';

export const useSpecialEffects = () => {
  // Handle special effects for admin messages
  const handleSpecialEffect = (effectType: string) => {
    switch (effectType) {
      case 'confetti':
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        break;
      case 'shake':
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
          chatContainer.classList.add('shake-animation');
          setTimeout(() => {
            chatContainer.classList.remove('shake-animation');
          }, 1000);
        }
        break;
      // Additional effects could be implemented here
    }
  };

  return {
    handleSpecialEffect
  };
};
