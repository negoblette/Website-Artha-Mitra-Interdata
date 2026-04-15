'use client';
import { useEffect, useRef } from 'react';

export default function WaveCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let t = 0;
    let animId;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function drawDotGrid(t) {
      const cols = 14, rows = 10;
      const spacingX = canvas.width * 0.024;
      const spacingY = canvas.height * 0.048;
      ctx.fillStyle = 'rgba(13,27,94,0.13)';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = c * spacingX + spacingX * 0.5;
          const by = r * spacingY + spacingY * 1.5;
          const drift = Math.sin(bx * 0.03 + t * 0.4) * 3;
          ctx.beginPath();
          ctx.arc(bx, by + drift, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.006;
      const W = canvas.width, H = canvas.height;

      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const nx = x / W;
        const y = H * 0.52
          + Math.sin(nx * Math.PI * 1.8 + t * 0.55) * H * 0.18
          + Math.sin(nx * Math.PI * 0.9 - t * 0.35) * H * 0.12
          + Math.sin(nx * Math.PI * 3.1 + t * 0.7) * H * 0.05;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = 'rgba(168,168,215,0.38)';
      ctx.fill();

      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const nx = x / W;
        const y = H * 0.38
          + Math.sin(nx * Math.PI * 2.4 + t * 0.7 + 1.1) * H * 0.20
          + Math.sin(nx * Math.PI * 1.2 - t * 0.4 + 0.5) * H * 0.13
          + Math.sin(nx * Math.PI * 4.2 + t * 0.9 + 2.2) * H * 0.04;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = 'rgba(148,148,205,0.32)';
      ctx.fill();

      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const nx = x / W;
        const bias = Math.pow(1 - nx, 1.4) * H * 0.28;
        const y = H * 0.60 + bias
          + Math.sin(nx * Math.PI * 2.0 + t * 0.65 + 2.5) * H * 0.16
          + Math.sin(nx * Math.PI * 1.1 - t * 0.5 + 1.8) * H * 0.10
          + Math.sin(nx * Math.PI * 3.8 + t * 0.8 + 0.9) * H * 0.05;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = 'rgba(130,130,195,0.28)';
      ctx.fill();

    //   ctx.beginPath();
    //   for (let x = 0; x <= W; x += 2) {
    //     const nx = (x - W * 0.45) / (W * 0.55);
    //     const y = H * 0.10
    //       + Math.sin(nx * Math.PI * 2.0 + t * 0.6 + 3.5) * H * 0.10
    //       + Math.sin(nx * Math.PI * 1.0 - t * 0.4 + 1.2) * H * 0.07;
    //     x === W * 0.45 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    //   }
    //   ctx.lineTo(W, H * 0.0); ctx.lineTo(W * 0.45, H * 0.0); ctx.closePath();
    //   ctx.fillStyle = 'rgba(175,175,220,0.30)';
    //   ctx.fill();

      const lineCount = 28;
      for (let i = 0; i < lineCount; i++) {
        const progress = i / lineCount;
        const baseY = H * (0.05 + progress * 0.88);
        const amp1 = H * (0.10 + progress * 0.08);
        const amp2 = H * (0.06 + progress * 0.04);
        const freq1 = 1.4 + progress * 1.2;
        const freq2 = 0.8 + progress * 0.6;
        const phase1 = t * (0.4 + progress * 0.3) + i * 0.22;
        const phase2 = t * (0.3 - progress * 0.15) + i * 0.35;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) {
          const nx = x / W;
          const y = baseY
            + Math.sin(nx * Math.PI * freq1 + phase1) * amp1
            + Math.sin(nx * Math.PI * freq2 + phase2) * amp2;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const alpha = 0.07 + progress * 0.06;
        ctx.strokeStyle = `rgba(80,80,150,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const nx = x / W;
        const y = H * 0.28 + nx * H * 0.25
          + Math.sin(nx * Math.PI * 2.5 + t * 0.6) * H * 0.08
          + Math.sin(nx * Math.PI * 1.2 - t * 0.4) * H * 0.05;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(80,80,150,0.18)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      drawDotGrid(t);
      animId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}