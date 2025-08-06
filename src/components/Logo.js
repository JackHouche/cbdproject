import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Utility function to help determine the best variant based on background
export const getRecommendedVariant = (backgroundColor) => {
  if (!backgroundColor) return 'auto';
  
  // Simple heuristic based on common background colors
  const bgLower = backgroundColor.toLowerCase();
  
  if (bgLower.includes('green') || bgLower.includes('#4caf') || bgLower.includes('#8bc3') || bgLower.includes('rgba(76, 175')) {
    return 'green';
  }
  
  if (bgLower.includes('dark') || bgLower.includes('#2e34') || bgLower.includes('#1a1a') || bgLower.includes('black')) {
    return 'dark';
  }
  
  if (bgLower.includes('white') || bgLower.includes('#fff') || bgLower.includes('#f8f9fa') || bgLower.includes('light')) {
    return 'light';
  }
  
  return 'auto';
};

const Logo = ({ 
  variant = 'auto', // 'auto', 'light', 'dark', 'green', 'contrast'
  height = '40px',
  sx = {},
  onClick,
  component,
  to,
  disableHover = false,
  ...props 
}) => {
  const theme = useTheme();

  // Determine the best logo styling based on variant
  const getLogoStyles = () => {
    const baseStyles = {
      height,
      width: 'auto',
      transition: 'all 0.3s ease',
      cursor: onClick || component ? 'pointer' : 'default',
    };

    // Add hover effects only if not disabled
    const hoverStyles = disableHover ? {} : {
      '&:hover': {
        transform: 'scale(1.05)',
      },
    };

    switch (variant) {
      case 'light':
        // For light backgrounds - add subtle shadow
        return {
          ...baseStyles,
          ...hoverStyles,
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
          '&:hover': {
            ...hoverStyles['&:hover'],
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))',
          },
        };
      
      case 'dark':
        // For dark backgrounds - add white glow/outline
        return {
          ...baseStyles,
          ...hoverStyles,
          filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8)) drop-shadow(0 2px 4px rgba(255, 255, 255, 0.4))',
          '&:hover': {
            ...hoverStyles['&:hover'],
            filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.9)) drop-shadow(0 4px 8px rgba(255, 255, 255, 0.5))',
          },
        };
      
      case 'green':
        // For green backgrounds - add strong white outline and shadow for maximum contrast
        return {
          ...baseStyles,
          ...hoverStyles,
          filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 1)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 1px rgba(255, 255, 255, 1))',
          '&:hover': {
            ...hoverStyles['&:hover'],
            filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 1)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 2px rgba(255, 255, 255, 1))',
          },
        };
      
      case 'contrast':
        // Maximum contrast for very problematic backgrounds
        return {
          ...baseStyles,
          ...hoverStyles,
          filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 1)) drop-shadow(0 0 3px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 1px rgba(255, 255, 255, 1)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))',
          '&:hover': {
            ...hoverStyles['&:hover'],
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 1)) drop-shadow(0 0 4px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 2px rgba(255, 255, 255, 1)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))',
          },
        };
      
      case 'auto':
      default:
        // Auto-detect based on theme or provide safe default
        return {
          ...baseStyles,
          ...hoverStyles,
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)) drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))',
          '&:hover': {
            ...hoverStyles['&:hover'],
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.7))',
          },
        };
    }
  };

  const logoProps = {
    component: component || 'img',
    src: "/logo-iocbd-transparent.png",
    alt: "IØCBD",
    sx: {
      ...getLogoStyles(),
      ...sx,
    },
    onClick,
    ...props
  };

  // If component is specified (like Link), we need to pass the 'to' prop
  if (component && to) {
    logoProps.to = to;
  }

  return <Box {...logoProps} />;
};

export default Logo;