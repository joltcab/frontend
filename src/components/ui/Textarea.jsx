import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Textarea = forwardRef(
  ({ className, error, label, helperText, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full px-3 py-2 text-sm bg-white border rounded-md shadow-sm',
            'placeholder:text-gray-400 resize-y',
            'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-joltcab-400 focus:border-joltcab-400',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            error
              ? 'border-red-300 focus:ring-red-400 focus:border-red-400'
              : 'border-gray-300',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
