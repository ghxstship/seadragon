
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface GlassProps {
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  border?: boolean;
  glow?: boolean;
  className?: string;
  children: React.ReactNode;
}

const blurValues = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
};

export function Glass({
  blur = 'md',
  opacity = 0.7,
  border = true,
  glow = false,
  className,
  children,
}: GlassProps) {
  return (
    <div
      className={cn(
        'relative',
        blurValues[blur],
        border && 'border border-white/10',
        'rounded-xl',
        'transition-all duration-300',
        glow && 'shadow-[0_0_30px_rgba(99,102,241,0.15)]',
        className
      )}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${opacity * 0.1})`,
      }}
    >
      {children}
    </div>
  );
}

export function GlassCard({
  children,
  className,
  hoverable = true,
  ...props
}: GlassProps & { hoverable?: boolean }) {
  return (
    <Glass
      className={cn(
        'p-6',
        hoverable && 'hover:shadow-lg hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </Glass>
  );
}

export function GlassNav({
  children,
  className,
  ...props
}: GlassProps) {
  return (
    <nav
      className={cn(
        'relative backdrop-blur-lg',
        'border border-white/10 rounded-xl',
        'sticky top-0 z-40',
        'px-4 py-3',
        className
      )}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${(props.opacity || 0.7) * 0.1})`,
      }}
    >
      {children}
    </nav>
  );
}

export function SoftSurface({
  children,
  className,
  inset = false,
}: {
  children: React.ReactNode;
  className?: string;
  inset?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-xl bg-bg-secondary',
        inset
          ? 'shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]'
          : 'shadow-[8px_8px_16px_rgba(0,0,0,0.05),-8px_-8px_16px_rgba(255,255,255,0.8)]',
        'dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-8px_-8px_16px_rgba(255,255,255,0.05)]',
        className
      )}
    >
      {children}
    </div>
  );
}

export function GradientText({
  children,
  gradient = 'primary',
  className,
}: {
  children: React.ReactNode;
  gradient?: 'primary' | 'success' | 'warm' | 'cool' | 'sunset';
  className?: string;
}) {
  const gradients = {
    primary: 'from-blue-500 via-purple-500 to-pink-500',
    success: 'from-green-400 to-emerald-600',
    warm: 'from-orange-400 via-pink-500 to-purple-600',
    cool: 'from-cyan-400 via-blue-500 to-purple-600',
    sunset: 'from-yellow-400 via-orange-500 to-red-500',
  };

  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        gradients[gradient],
        className
      )}
    >
      {children}
    </span>
  );
}

export function AtmosphericBackground({
  children,
  className,
  variant = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'vibrant';
}) {
  const variants = {
    default: 'before:bg-gradient-radial before:from-accent-primary/10 before:to-transparent',
    subtle: 'before:bg-gradient-radial before:from-accent-primary/5 before:to-transparent',
    vibrant: 'before:bg-gradient-radial before:from-purple-500/20 before:via-pink-500/10 before:to-transparent',
  };

  return (
    <div
      className={cn(
        'relative',
        'before:absolute before:inset-0 before:pointer-events-none',
        'before:h-[400px] before:w-full',
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

export function GlowEffect({
  children,
  className,
  color = 'primary',
  intensity = 'medium',
}: {
  children: React.ReactNode;
  className?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  intensity?: 'low' | 'medium' | 'high';
}) {
  const colors = {
    primary: 'rgba(99, 102, 241, VAR)',
    success: 'rgba(16, 185, 129, VAR)',
    warning: 'rgba(245, 158, 11, VAR)',
    error: 'rgba(239, 68, 68, VAR)',
  };

  const intensities = {
    low: 0.15,
    medium: 0.25,
    high: 0.4,
  };

  const glowColor = colors[color].replace('VAR', String(intensities[intensity]));

  return (
    <div
      className={cn('relative group', className)}
    >
      <div
        className={cn(
          'absolute inset-0 rounded-xl blur-xl',
          'opacity-0 group-hover:opacity-100',
          'transition-opacity duration-300',
          '-z-10'
        )}
        style={{ backgroundColor: glowColor }}
      />
      {children}
    </div>
  );
}

export default Glass;
