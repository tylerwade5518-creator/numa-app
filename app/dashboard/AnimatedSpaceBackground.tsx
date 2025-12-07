"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  isGold: boolean;
};

const STAR_COUNT = 180;

export default function AnimatedSpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resize);

    const createStar = (): Star => {
      const angle = Math.random() * Math.PI * 2;
      // Slightly faster drift than before
      const speed = 0.2 + Math.random() * 0.08;

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 0.7 + Math.random() * 1.1,
        isGold: Math.random() < 0.32, // ~32% gold stars
      };
    };

    let stars: Star[] = Array.from({ length: STAR_COUNT }, createStar);

    const drawStars = () => {
      // Clear previous stars; background image is CSS, so it remains visible
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        // Move star
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around edges
        if (star.x < 0) star.x += width;
        if (star.x > width) star.x -= width;
        if (star.y < 0) star.y += height;
        if (star.y > height) star.y -= height;

        // Subtle twinkle
        const twinkle =
          0.85 +
          Math.sin((star.x + star.y) * 0.003 + star.size * 7) * 0.15;

        const alpha = 0.3 + twinkle * 0.5;
        const radius = star.size;

        if (star.isGold) {
          ctx.fillStyle = `rgba(253, 224, 71, ${alpha})`; // soft gold
        } else {
          ctx.fillStyle = `rgba(248, 250, 252, ${alpha})`; // cool white
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawFrame = () => {
      drawStars();
      animationRef.current = requestAnimationFrame(drawFrame);
    };

    if (prefersReducedMotion) {
      drawStars(); // one static frame
    } else {
      drawFrame();
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
