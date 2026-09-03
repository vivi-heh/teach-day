import React, { useEffect, useRef } from 'react';
import { CelebrationAnimationType } from '../../types';

interface CelebrationCanvasProps {
  animationType: CelebrationAnimationType;
  className?: string;
}

export const CelebrationCanvas: React.FC<CelebrationCanvasProps> = ({
  animationType,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Particle sets based on animationType
    // 1. Fireworks
    interface FireworkParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
      color: string;
      size: number;
      flicker: boolean;
    }
    interface Rocket {
      x: number;
      y: number;
      targetY: number;
      speed: number;
      color: string;
    }
    let fireworks: FireworkParticle[] = [];
    let rockets: Rocket[] = [];

    // 2. Balloons & Lanterns
    interface Balloon {
      x: number;
      y: number;
      radius: number;
      color: string;
      speed: number;
      swayOffset: number;
      swaySpeed: number;
      stringLength: number;
      isLantern?: boolean;
    }
    let balloons: Balloon[] = [];

    // 3. Origami Cranes
    interface Crane {
      x: number;
      y: number;
      vx: number;
      vy: number;
      scale: number;
      flapAngle: number;
      flapSpeed: number;
      color: string;
      angle: number;
    }
    let cranes: Crane[] = [];

    // 4. Blossom Petals
    interface Petal {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      angle: number;
      spinSpeed: number;
      color: string;
      petalType: 'sakura' | 'rose' | 'leaf';
    }
    let petals: Petal[] = [];

    // 5. Trophy Confetti Cannons
    interface ConfettiPiece {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotSpeed: number;
      tilt: number;
      tiltSpeed: number;
      shape: 'rect' | 'star' | 'circle';
    }
    let confettiList: ConfettiPiece[] = [];

    // 6. Chalkboard Sparks & Doodles
    interface ChalkItem {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
      symbol: string;
      size: number;
      color: string;
      rotation: number;
    }
    let chalkList: ChalkItem[] = [];

    // Initialize systems
    const fireColors = ['#E63946', '#E9C46A', '#F4A261', '#A8DADC', '#457B9D', '#FFD166', '#FFFFFF'];

    const spawnFireworkBurst = (bx: number, by: number, count = 70) => {
      const baseColor = fireColors[Math.floor(Math.random() * fireColors.length)];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.2 - 0.1);
        const speed = Math.random() * 4.5 + 2.5;
        fireworks.push({
          x: bx,
          y: by,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.01,
          color: Math.random() > 0.3 ? baseColor : '#FFFFFF',
          size: Math.random() * 3 + 1.5,
          flicker: Math.random() > 0.5,
        });
      }
    };

    if (animationType === 'fireworks') {
      // Spawn initial bursts
      spawnFireworkBurst(width * 0.3, height * 0.35, 60);
      spawnFireworkBurst(width * 0.7, height * 0.3, 60);
      spawnFireworkBurst(width * 0.5, height * 0.2, 80);
    } else if (animationType === 'balloons') {
      const balloonColors = ['#E63946', '#E9C46A', '#F4A261', '#A8DADC', '#2A9D8F', '#E76F51', '#457B9D'];
      for (let i = 0; i < 28; i++) {
        balloons.push({
          x: Math.random() * width,
          y: height + Math.random() * height * 0.8,
          radius: Math.random() * 14 + 16,
          color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
          speed: Math.random() * 1.6 + 1.2,
          swayOffset: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.02 + 0.015,
          stringLength: Math.random() * 30 + 35,
          isLantern: i % 4 === 0,
        });
      }
    } else if (animationType === 'origami') {
      const origamiColors = ['#E63946', '#E9C46A', '#A8DADC', '#F4A261', '#264653', '#FDFCFB'];
      for (let i = 0; i < 18; i++) {
        cranes.push({
          x: Math.random() * (width * 0.8) - width * 0.2,
          y: height * 0.7 + Math.random() * height * 0.5,
          vx: Math.random() * 1.8 + 1.2,
          vy: -(Math.random() * 1.6 + 1.2),
          scale: Math.random() * 0.45 + 0.7,
          flapAngle: Math.random() * Math.PI * 2,
          flapSpeed: Math.random() * 0.08 + 0.07,
          color: origamiColors[Math.floor(Math.random() * origamiColors.length)],
          angle: -0.25 + (Math.random() * 0.1 - 0.05),
        });
      }
    } else if (animationType === 'blossom') {
      const petalColors = ['#FFB7B2', '#FF9AA2', '#E63946', '#FFDAC1', '#F4A261', '#E9C46A'];
      for (let i = 0; i < 45; i++) {
        petals.push({
          x: Math.random() * width,
          y: Math.random() * height - height,
          size: Math.random() * 8 + 8,
          speedX: Math.random() * 2 + 1,
          speedY: Math.random() * 2.2 + 1.5,
          angle: Math.random() * Math.PI * 2,
          spinSpeed: (Math.random() - 0.5) * 0.04,
          color: petalColors[Math.floor(Math.random() * petalColors.length)],
          petalType: i % 3 === 0 ? 'rose' : 'sakura',
        });
      }
    } else if (animationType === 'trophy') {
      // Confetti cannons from bottom corners
      const confettiColors = ['#E63946', '#E9C46A', '#F4A261', '#A8DADC', '#264653', '#FFFFFF'];
      for (let i = 0; i < 90; i++) {
        // Left Cannon
        confettiList.push({
          x: 40 + Math.random() * 40,
          y: height - 20,
          vx: Math.random() * 9 + 4,
          vy: -(Math.random() * 14 + 10),
          size: Math.random() * 8 + 6,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 8,
          tilt: Math.random() * 10,
          tiltSpeed: Math.random() * 0.1 + 0.05,
          shape: Math.random() > 0.4 ? 'rect' : 'star',
        });

        // Right Cannon
        confettiList.push({
          x: width - 40 - Math.random() * 40,
          y: height - 20,
          vx: -(Math.random() * 9 + 4),
          vy: -(Math.random() * 14 + 10),
          size: Math.random() * 8 + 6,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 8,
          tilt: Math.random() * 10,
          tiltSpeed: Math.random() * 0.1 + 0.05,
          shape: Math.random() > 0.4 ? 'rect' : 'circle',
        });
      }
    } else if (animationType === 'chalkboard') {
      const symbols = ['{ }', '</>', '01', '∞', 'π', 'λ', '∑', '∫', 'f(x)', '√', 'Ω', '&&'];
      const chalkColors = ['#E9C46A', '#E63946', '#A8DADC', '#F4A261', '#FFFFFF', '#FDFCFB'];
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        chalkList.push({
          x: width * 0.5 + (Math.random() - 0.5) * 200,
          y: height * 0.4 + (Math.random() - 0.5) * 160,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          alpha: 1,
          decay: Math.random() * 0.012 + 0.008,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          size: Math.random() * 12 + 14,
          color: chalkColors[Math.floor(Math.random() * chalkColors.length)],
          rotation: Math.random() * Math.PI * 2,
        });
      }
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. FIREWORKS RENDER
      if (animationType === 'fireworks') {
        // Occasionally launch new rockets
        if (frame % 35 === 0 && Math.random() > 0.25) {
          rockets.push({
            x: Math.random() * (width * 0.7) + width * 0.15,
            y: height,
            targetY: height * 0.15 + Math.random() * (height * 0.35),
            speed: Math.random() * 6 + 9,
            color: fireColors[Math.floor(Math.random() * fireColors.length)],
          });
        }

        // Draw and update rockets
        for (let i = rockets.length - 1; i >= 0; i--) {
          const r = rockets[i];
          r.y -= r.speed;

          ctx.save();
          ctx.strokeStyle = r.color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x, r.y + 12);
          ctx.stroke();
          ctx.restore();

          if (r.y <= r.targetY) {
            spawnFireworkBurst(r.x, r.y, 65);
            rockets.splice(i, 1);
          }
        }

        // Draw and update burst particles
        for (let i = fireworks.length - 1; i >= 0; i--) {
          const p = fireworks[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.06; // gravity
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            fireworks.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Sparkle halo
          if (p.flicker && Math.random() > 0.4) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
          }
          ctx.restore();
        }
      }

      // 2. BALLOONS & SKY LANTERNS RENDER
      else if (animationType === 'balloons') {
        balloons.forEach((b) => {
          b.y -= b.speed;
          b.swayOffset += b.swaySpeed;
          const currentX = b.x + Math.sin(b.swayOffset) * 18;

          // Wrap around top to bottom
          if (b.y < -80) {
            b.y = height + 60;
            b.x = Math.random() * width;
          }

          ctx.save();
          if (b.isLantern) {
            // Glowing Sky Lantern
            const grad = ctx.createRadialGradient(currentX, b.y, 2, currentX, b.y, b.radius * 1.5);
            grad.addColorStop(0, '#FFF3B0');
            grad.addColorStop(0.4, '#E9C46A');
            grad.addColorStop(1, 'rgba(233, 196, 106, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(currentX, b.y, b.radius * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Lantern body
            ctx.fillStyle = '#E9C46A';
            ctx.strokeStyle = '#121212';
            ctx.lineWidth = 2;
            ctx.fillRect(currentX - b.radius * 0.7, b.y - b.radius, b.radius * 1.4, b.radius * 2);
            ctx.strokeRect(currentX - b.radius * 0.7, b.y - b.radius, b.radius * 1.4, b.radius * 2);

            // Candle flame center
            ctx.fillStyle = '#E63946';
            ctx.beginPath();
            ctx.arc(currentX, b.y + b.radius * 0.4, 3, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Crisp Neo-Brutalist Balloon
            ctx.fillStyle = b.color;
            ctx.strokeStyle = '#121212';
            ctx.lineWidth = 2.5;

            // Balloon oval
            ctx.beginPath();
            ctx.ellipse(currentX, b.y, b.radius * 0.85, b.radius, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Knot
            ctx.beginPath();
            ctx.moveTo(currentX - 3, b.y + b.radius);
            ctx.lineTo(currentX + 3, b.y + b.radius);
            ctx.lineTo(currentX, b.y + b.radius + 4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Highlight shine
            ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
            ctx.beginPath();
            ctx.ellipse(currentX - b.radius * 0.3, b.y - b.radius * 0.35, 3, 6, -0.4, 0, Math.PI * 2);
            ctx.fill();

            // Balloon wavy string
            ctx.strokeStyle = '#121212';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(currentX, b.y + b.radius + 4);
            ctx.bezierCurveTo(
              currentX - 6,
              b.y + b.radius + 15,
              currentX + 8,
              b.y + b.radius + 28,
              currentX - 2,
              b.y + b.radius + b.stringLength
            );
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      // 3. ORIGAMI CRANES RENDER
      else if (animationType === 'origami') {
        cranes.forEach((crane) => {
          crane.x += crane.vx;
          crane.y += crane.vy;
          crane.flapAngle += crane.flapSpeed;

          // Wrap
          if (crane.y < -60 || crane.x > width + 60) {
            crane.x = -50;
            crane.y = height * 0.6 + Math.random() * (height * 0.4);
          }

          ctx.save();
          ctx.translate(crane.x, crane.y);
          ctx.rotate(crane.angle);
          ctx.scale(crane.scale, crane.scale);

          const flapY = Math.sin(crane.flapAngle) * 12;

          // Draw Origami Crane geometric facets
          ctx.strokeStyle = '#121212';
          ctx.lineWidth = 2;
          ctx.lineJoin = 'round';

          // Body
          ctx.fillStyle = crane.color;
          ctx.beginPath();
          ctx.moveTo(-18, 0);
          ctx.lineTo(0, 10);
          ctx.lineTo(16, 0);
          ctx.lineTo(0, -6);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Left Wing
          ctx.fillStyle = crane.color === '#FDFCFB' ? '#E9C46A' : '#F1FAEE';
          ctx.beginPath();
          ctx.moveTo(-4, -2);
          ctx.lineTo(-2, -24 + flapY);
          ctx.lineTo(12, -2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Neck & Beak
          ctx.fillStyle = crane.color;
          ctx.beginPath();
          ctx.moveTo(14, 0);
          ctx.lineTo(24, -14);
          ctx.lineTo(20, -12);
          ctx.lineTo(12, 4);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Tail
          ctx.beginPath();
          ctx.moveTo(-14, 0);
          ctx.lineTo(-26, -10);
          ctx.lineTo(-12, 4);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.restore();
        });
      }

      // 4. BLOSSOM CASCADE RENDER
      else if (animationType === 'blossom') {
        petals.forEach((p) => {
          p.y += p.speedY;
          p.x += p.speedX + Math.sin(p.angle) * 1.5;
          p.angle += p.spinSpeed;

          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);

          ctx.fillStyle = p.color;
          ctx.strokeStyle = '#121212';
          ctx.lineWidth = 1.5;

          // Draw Petal Shape
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.5, p.size * 0.7, p.size * 0.5, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.5, -p.size * 0.7, -p.size * 0.5, 0, -p.size);
          ctx.fill();
          ctx.stroke();

          // Petal vein
          ctx.strokeStyle = 'rgba(18, 18, 18, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.6);
          ctx.lineTo(0, p.size * 0.6);
          ctx.stroke();

          ctx.restore();
        });
      }

      // 5. TROPHY CONFETTI CANNONS RENDER
      else if (animationType === 'trophy') {
        // Keep adding new burst stream
        if (frame < 180 && frame % 4 === 0) {
          const confettiColors = ['#E63946', '#E9C46A', '#F4A261', '#A8DADC', '#264653', '#FFFFFF'];
          confettiList.push({
            x: 50,
            y: height - 20,
            vx: Math.random() * 8 + 5,
            vy: -(Math.random() * 15 + 10),
            size: Math.random() * 7 + 5,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 8,
            tilt: 0,
            tiltSpeed: Math.random() * 0.1 + 0.05,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
          });

          confettiList.push({
            x: width - 50,
            y: height - 20,
            vx: -(Math.random() * 8 + 5),
            vy: -(Math.random() * 15 + 10),
            size: Math.random() * 7 + 5,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 8,
            tilt: 0,
            tiltSpeed: Math.random() * 0.1 + 0.05,
            shape: Math.random() > 0.5 ? 'rect' : 'star',
          });
        }

        for (let i = confettiList.length - 1; i >= 0; i--) {
          const c = confettiList[i];
          c.x += c.vx;
          c.y += c.vy;
          c.vy += 0.28; // gravity
          c.vx *= 0.985; // air drag
          c.rotation += c.rotSpeed;
          c.tilt += c.tiltSpeed;

          if (c.y > height + 40) {
            confettiList.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate((c.rotation * Math.PI) / 180);
          ctx.scale(Math.cos(c.tilt), 1);

          ctx.fillStyle = c.color;
          ctx.strokeStyle = '#121212';
          ctx.lineWidth = 1.5;

          if (c.shape === 'rect') {
            ctx.fillRect(-c.size, -c.size * 0.6, c.size * 2, c.size * 1.2);
            ctx.strokeRect(-c.size, -c.size * 0.6, c.size * 2, c.size * 1.2);
          } else if (c.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, c.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          } else {
            // Star
            ctx.beginPath();
            for (let s = 0; s < 5; s++) {
              ctx.lineTo(Math.cos(((18 + s * 72) * Math.PI) / 180) * c.size, -Math.sin(((18 + s * 72) * Math.PI) / 180) * c.size);
              ctx.lineTo(Math.cos(((54 + s * 72) * Math.PI) / 180) * (c.size * 0.45), -Math.sin(((54 + s * 72) * Math.PI) / 180) * (c.size * 0.45));
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          ctx.restore();
        }
      }

      // 6. CHALKBOARD SPARKLES & DOODLES RENDER
      else if (animationType === 'chalkboard') {
        // Continuous spawn from center
        if (frame % 8 === 0 && Math.random() > 0.3) {
          const symbols = ['{ }', '</>', '01', '∞', 'π', 'λ', '∑', '∫', 'f(x)', '√', 'Ω', '&&'];
          const chalkColors = ['#E9C46A', '#E63946', '#A8DADC', '#F4A261', '#FFFFFF', '#FDFCFB'];
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 3.5 + 1.5;
          chalkList.push({
            x: width * 0.5 + (Math.random() - 0.5) * 120,
            y: height * 0.45 + (Math.random() - 0.5) * 100,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.5,
            alpha: 1,
            decay: Math.random() * 0.012 + 0.008,
            symbol: symbols[Math.floor(Math.random() * symbols.length)],
            size: Math.random() * 12 + 14,
            color: chalkColors[Math.floor(Math.random() * chalkColors.length)],
            rotation: Math.random() * Math.PI * 2,
          });
        }

        for (let i = chalkList.length - 1; i >= 0; i--) {
          const ch = chalkList[i];
          ch.x += ch.vx;
          ch.y += ch.vy;
          ch.alpha -= ch.decay;
          ch.rotation += 0.02;

          if (ch.alpha <= 0) {
            chalkList.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = ch.alpha;
          ctx.translate(ch.x, ch.y);
          ctx.rotate(ch.rotation);
          ctx.font = `bold ${ch.size}px monospace, sans-serif`;
          ctx.fillStyle = ch.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(ch.symbol, 0, 0);

          // Chalk glow
          ctx.shadowColor = ch.color;
          ctx.shadowBlur = 6;
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [animationType]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-10 ${className}`}
    />
  );
};
