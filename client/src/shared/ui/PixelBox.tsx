interface PixelBoxProps {
  children: React.ReactNode;
  className?: string;
}

export function PixelBox({ children, className = '' }: PixelBoxProps) {
  return (
    <div className={`pixel-box p-4 ${className}`}>
      {children}
    </div>
  );
}
