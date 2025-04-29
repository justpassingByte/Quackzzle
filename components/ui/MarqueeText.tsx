"use client";

import React, { useEffect, useRef } from 'react';

interface MarqueeTextProps {
  text: string;
  className?: string;
  speed?: number; // Tốc độ chạy (px/giây)
}

export function MarqueeText({ text, className = '', speed = 50 }: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;
    
    // Tạo một bản sao của nội dung để tạo hiệu ứng liên tục
    const clone = content.cloneNode(true) as HTMLDivElement;
    container.appendChild(clone);
    
    let animationId: number;
    let position = 0;
    
    const animate = () => {
      position -= 1;
      
      // Khi nội dung đầu tiên đã chạy hết, reset vị trí
      if (position <= -content.offsetWidth) {
        position = 0;
      }
      
      // Áp dụng vị trí mới
      content.style.transform = `translateX(${position}px)`;
      clone.style.transform = `translateX(${position + content.offsetWidth}px)`;
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    // Dọn dẹp khi component unmount
    return () => {
      cancelAnimationFrame(animationId);
      if (container.contains(clone)) {
        container.removeChild(clone);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`overflow-hidden whitespace-nowrap ${className}`}
    >
      <div 
        ref={contentRef} 
        className="inline-block"
        style={{ willChange: 'transform' }}
      >
        {text}
      </div>
    </div>
  );
} 