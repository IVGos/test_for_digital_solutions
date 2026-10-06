interface PixelInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function PixelInput({ value, onChange, placeholder, className = '' }: PixelInputProps) {
  return (
    <input
      type="text"
      className={`pixel-input w-full ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

interface PixelTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function PixelTextarea({ value, onChange, placeholder, rows = 4, className = '' }: PixelTextareaProps) {
  return (
    <textarea
      className={`pixel-input w-full resize-y ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
    />
  );
}
