import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  variant: {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    primary: 'bg-joltcab-100 text-joltcab-800 border-joltcab-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  size: {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  },
};

const Badge = forwardRef(
  ({ className, variant = 'default', size = 'sm', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 font-medium border rounded-full',
          badgeVariants.variant[variant],
          badgeVariants.size[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
