/**
 * Confetti effect voor bedankt-pagina
 */

(function() {
  'use strict';

  function createConfetti() {
    const confettiCount = 150;
    const colors = ['#2a55a2', '#3b82f6', '#60a5fa', '#93c5fd', '#fbbf24', '#f59e0b'];
    const container = document.createElement('div');
    
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;
    
    document.body.appendChild(container);

    for (let i = 0; i < confettiCount; i++) {
      createConfettiPiece(container, colors);
    }

    // Verwijder container na animatie
    setTimeout(() => {
      container.remove();
    }, 5000);
  }

  function createConfettiPiece(container, colors) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const animationDuration = 2 + Math.random() * 3;
    const size = 8 + Math.random() * 8;
    const rotation = Math.random() * 360;
    const delay = Math.random() * 0.5;

    confetti.style.cssText = `
      position: absolute;
      left: ${left}%;
      top: -10%;
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      opacity: 0.9;
      transform: rotate(${rotation}deg);
      animation: confetti-fall ${animationDuration}s linear ${delay}s forwards;
    `;

    container.appendChild(confetti);
  }

  // CSS animatie toevoegen
  const style = document.createElement('style');
  style.textContent = `
    @keyframes confetti-fall {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Start confetti wanneer pagina geladen is
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createConfetti);
  } else {
    createConfetti();
  }
})();
