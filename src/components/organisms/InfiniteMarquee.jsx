import React, { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';
import TemplateCard from './TemplateCard';

function useInfiniteScroll(speed, direction, paused) {
  const x = useMotionValue(0);
  const dirMultiplier = direction === 'right' ? 1 : -1;

  useAnimationFrame((_, delta) => {
    if (paused.current) return;
    const moveBy = dirMultiplier * speed * (delta / 1000);
    x.set(x.get() + moveBy);
  });

  return x;
}

function MarqueeRow({ templates, speed, direction, cardWidth, gap, fadeColor }) {
  const paused = useRef(false);
  const x = useInfiniteScroll(speed, direction, paused);

  const items = [...templates, ...templates, ...templates];
  const totalWidth = templates.length * (cardWidth + gap);

  const xTransformed = useTransform(x, (val) => {
    const mod = val % totalWidth;
    return direction === 'left'
      ? mod > 0 ? mod - totalWidth : mod
      : mod < 0 ? mod + totalWidth : mod;
  });

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '120px',
        background: `linear-gradient(to right, ${fadeColor}, transparent)`,
        zIndex: 10, pointerEvents: 'none',
      }} />
      {/* Fade derecho */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: '120px',
        background: `linear-gradient(to left, ${fadeColor}, transparent)`,
        zIndex: 10, pointerEvents: 'none',
      }} />

      <motion.div
        style={{
          x: xTransformed,
          display: 'flex',
          gap: `${gap}px`,
          width: 'max-content',
          willChange: 'transform',
          paddingTop: '8px',
          paddingBottom: '16px',
        }}
      >
        {items.map((template, idx) => (
          <div
            key={`${template.id}-${idx}`}
            style={{ width: `${cardWidth}px`, flexShrink: 0 }}
          >
            <TemplateCard template={template} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

const InfiniteMarquee = ({
  templates = [],
  speed = 40,
  cardWidth = 300,
  gap = 20,
  fadeColor = '#f8fafc',
}) => {
  if (!templates.length) return null;

  const half = Math.ceil(templates.length / 2);
  const row1 = templates.slice(0, half);
  const row2 = templates.length > half ? templates.slice(half) : [...templates].reverse();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <MarqueeRow templates={row1} speed={speed} direction="left"  cardWidth={cardWidth} gap={gap} fadeColor={fadeColor} />
      <MarqueeRow templates={row2} speed={speed * 0.75} direction="right" cardWidth={cardWidth} gap={gap} fadeColor={fadeColor} />
    </div>
  );
};

export default InfiniteMarquee;