"use client"

import React, { useEffect, useRef } from 'react';

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  initialSize: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 2;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = -Math.random() * 3 - 1;
    this.life = 100;
    this.initialSize = this.size;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 1;
    this.size = Math.max(0, this.initialSize * (this.life / 100));
  }
}

interface SmokeCardProps {
  className?: string;
  children?: React.ReactNode;
  smokeColor?: string;
  listenToWindow?: boolean;
}

const SmokeCard: React.FC<SmokeCardProps> = ({ className, children, smokeColor, listenToWindow = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update particles
      particlesRef.current = particlesRef.current
        .filter(particle => particle.life > 0 && particle.size > 0)
        .map(particle => {
          particle.update();
          
          // Draw particle
          if (particle.size > 0) {
            const opacity = particle.life / 100;
            ctx.fillStyle = smokeColor
              ? `${smokeColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
              : `rgba(241, 138, 85, ${opacity * 0.45})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          }
          
          return particle;
        });

      // Add new particles near mouse position
      if (mousePosRef.current.x !== 0 && mousePosRef.current.y !== 0) {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push(
            new Particle(
              mousePosRef.current.x + (Math.random() * 14 - 7),
              mousePosRef.current.y + (Math.random() * 14 - 7)
            )
          );
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Set initial canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    animate();

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mousePosRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      } else {
        mousePosRef.current = { x: 0, y: 0 };
      }
    };

    if (listenToWindow) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (listenToWindow) {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [smokeColor, listenToWindow]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (listenToWindow) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseLeave = () => {
    mousePosRef.current = { x: 0, y: 0 };
  };

  return (
    <div className={className || "w-96 h-96 relative overflow-hidden bg-black rounded-lg border border-white/10"}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="absolute top-0 left-0 w-full h-full pointer-events-auto"
      />
      {children}
    </div>
  );
};

export { SmokeCard };
