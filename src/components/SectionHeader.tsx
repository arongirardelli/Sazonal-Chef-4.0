import React from 'react';
import { useAppPreferences } from '../contexts/AppPreferencesContext';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  subtitle, 
  icon,
  className = ''
}) => {
  const { colors, fontSizes } = useAppPreferences();

  return (
    <div 
      className={className}
      style={{
        marginBottom: '32px',
        paddingLeft: '20px',
        paddingRight: '20px',
        textAlign: 'left',
        position: 'relative'
      }}
    >
      {/* Icon Container */}
      {icon && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}10)`,
            border: `1px solid ${colors.primary}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}>
            {icon}
          </div>
        </div>
      )}

      {/* Title */}
      <h2 style={{
        fontSize: fontSizes['2xl'],
        fontWeight: 700,
        color: colors.primary,
        margin: '0 0 12px 0',
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        position: 'relative'
      }}>
        {title}
      </h2>

      {/* Decorative Line */}
      <div style={{
        width: '60px',
        height: '2px',
        background: `linear-gradient(90deg, ${colors.primary}, ${colors.primary}60)`,
        margin: '0 0 16px 0',
        borderRadius: '1px'
      }} />

      {/* Subtitle */}
      <p style={{
        fontSize: fontSizes.base,
        color: colors.textSecondary,
        margin: '0',
        lineHeight: 1.6,
        maxWidth: '600px',
        fontWeight: 400
      }}>
        {subtitle}
      </p>
    </div>
  );
};
