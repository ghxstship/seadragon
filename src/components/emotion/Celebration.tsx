
'use client';

import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

type CelebrationType = 'confetti' | 'stars' | 'fireworks' | 'subtle' | 'checkmark';

interface CelebrationProps {
  type?: CelebrationType;
  trigger: boolean;
  message?: string;
  duration?: number;
  onComplete?: () => void;
  className?: string;
}

function createConfettiParticle(container: HTMLElement) {
  const particle = document.createElement('div');
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  particle.style.cssText = `
    position: absolute;
    width: ${Math.random() * 10 + 5}px;
    height: ${Math.random() * 10 + 5}px;
    background: ${color};
    left: ${Math.random() * 100}%;
    top: -20px;
    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
    transform: rotate(${Math.random() * 360}deg);
    animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
  `;
  
  container.appendChild(particle);
  
  setTimeout(() => {
    particle.remove();
  }, 4000);
}

function createStarParticle(container: HTMLElement) {
  const particle = document.createElement('div');
  const colors = ['#ffd700', '#ffec8b', '#fff8dc'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = Math.random() * 15 + 10;
  
  particle.textContent = '';
  particle.style.cssText = `
    position: absolute;
    font-size: ${size}px;
    color: ${color};
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    animation: star-burst 1s ease-out forwards;
    text-shadow: 0 0 10px ${color};
  `;
  
  container.appendChild(particle);
  
  setTimeout(() => {
    particle.remove();
  }, 1000);
}

export function Celebration({
  type = 'confetti',
  trigger,
  message,
  duration = 3000,
  onComplete,
  className,
}: CelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const runCelebration = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    switch (type) {
      case 'confetti':
        for (let i = 0; i < 50; i++) {
          setTimeout(() => createConfettiParticle(container), i * 30);
        }
        break;

      case 'stars':
        for (let i = 0; i < 20; i++) {
          setTimeout(() => createStarParticle(container), i * 50);
        }
        break;

      case 'fireworks':
        const burstCount = 5;
        for (let burst = 0; burst < burstCount; burst++) {
          setTimeout(() => {
            for (let i = 0; i < 15; i++) {
              createStarParticle(container);
            }
          }, burst * 200);
        }
        break;

      case 'subtle':
      case 'checkmark':
        break;
    }
  }, [type]);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      runCelebration();

      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration, onComplete, runCelebration]);

  if (!trigger && !isVisible) return null;

  return (
    <>
      {/* Particle container */}
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
        aria-hidden="true"
      />

      {/* Message */}
      {message && isVisible && (
        <div
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
            'px-6 py-4 rounded-2xl',
            'bg-bg-elevated border border-border-default shadow-xl',
            'animate-in zoom-in-95 fade-in duration-300',
            className
          )}
        >
          <div className="flex items-center gap-3">
            {type === 'checkmark' && (
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400 animate-[checkmark_0.4s_ease-out]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                    className="animate-[draw-check_0.3s_ease-out_0.1s_forwards]"
                    style={{
                      strokeDasharray: 24,
                      strokeDashoffset: 24,
                    }}
                  />
                </svg>
              </div>
            )}
            <span className="text-lg font-medium text-text-primary">{message}</span>
            {type !== 'checkmark' && type !== 'subtle' && (
              <span className="text-2xl" role="img" aria-label="celebration">
                
              </span>
            )}
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx global>{`
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

        @keyframes star-burst {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes draw-check {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </>
  );
}

export function useCelebration() {
  const [celebrationState, setCelebrationState] = useState<{
    trigger: boolean;
    type: CelebrationType;
    message?: string;
  }>({
    trigger: false,
    type: 'confetti',
    message: undefined,
  });

  const celebrate = useCallback((
    type: CelebrationType = 'confetti',
    message?: string
  ) => {
    setCelebrationState({ trigger: true, type, message });
  }, []);

  const reset = useCallback(() => {
    setCelebrationState((prev) => ({ ...prev, trigger: false }));
  }, []);

  return {
    ...celebrationState,
    celebrate,
    reset,
  };
}

export default Celebration;
