import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Panorama logo with an abstract hexagonal neural-network node mark
 * and the wordmark "PANORAMA." — responsive, animated, accessible.
 */
export const Logo: React.FC = () => {
  return (
    <Link to="/" className="hdr-logo" aria-label="Panorama — go to homepage">
      <motion.div
        className="hdr-logo-mark"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* Abstract hexagonal neural-node "P" symbol */}
        <svg
          width={32}
          height={32}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          {/* Outer hexagon */}
          <path
            d="M16 2 L28.5 9 L28.5 23 L16 30 L3.5 23 L3.5 9 Z"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinejoin="round"
          />

          {/* Inner connection lines — neural network edges */}
          <line x1={10} y1={12} x2={22} y2={12} stroke="currentColor" strokeWidth={1.4} />
          <line x1={10} y1={12} x2={10} y2={24} stroke="currentColor" strokeWidth={1.4} />
          <line x1={10} y1={12} x2={16} y2={20} stroke="currentColor" strokeWidth={1.4} />
          <line x1={22} y1={12} x2={16} y2={20} stroke="currentColor" strokeWidth={1.4} />

          {/* Neural-node dots */}
          <circle cx={10} cy={12} r={2} fill="currentColor" />
          <circle cx={22} cy={12} r={2} fill="currentColor" />
          <circle cx={16} cy={20} r={2} fill="currentColor" />
          <circle cx={10} cy={24} r={2} fill="currentColor" />
        </svg>
      </motion.div>

      <span className="hdr-logo-text">
        PANORAMA
        <span className="hdr-logo-dot" aria-hidden="true">
          .
        </span>
      </span>
    </Link>
  );
};
