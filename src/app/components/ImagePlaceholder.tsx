interface ImagePlaceholderProps {
  label: string;
  className?: string;
  height?: string;
}

export function ImagePlaceholder({ label, className = "", height = "h-64" }: ImagePlaceholderProps) {
  return (
    <div
      className={`${height} ${className} flex items-center justify-center rounded-2xl`}
      style={{ backgroundColor: "#95D5B2", border: "2px dashed #52B788" }}
    >
      <div className="text-center px-6">
        <div className="text-4xl mb-2">🍄</div>
        <p className="text-sm" style={{ color: "#2D6A4F", fontFamily: "Nunito, sans-serif" }}>
          {label}
        </p>
      </div>
    </div>
  );
}
