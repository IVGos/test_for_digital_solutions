interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'ghost';
  className?: string;
}

export function PixelButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
}: PixelButtonProps) {
  const variantStyles = {
    primary: 'pixel-btn',
    danger: 'pixel-btn !bg-pixel-danger',
    ghost: 'pixel-btn !bg-transparent !text-pixel-text !border-pixel-border',
  };

  return (
    <button
      className={`${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
