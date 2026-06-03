import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-dark">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`w-full px-4 py-2.5 rounded-xl border bg-white text-dark text-sm placeholder:text-muted/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lilac-dark/30 focus:border-lilac-dark hover:border-lilac/50 resize-y min-h-[100px] ${
            error
              ? 'border-red-300 focus:ring-red-300/30 focus:border-red-400'
              : 'border-border'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1 animate-slide-down">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
