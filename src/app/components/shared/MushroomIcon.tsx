import mushroom2 from "../../../assets/icons/mushroom2.svg";

interface MushroomIconProps {
  size?: number;
  className?: string;
}

export function MushroomIcon({ size = 14, className }: MushroomIconProps) {
  return (
    <img
      src={mushroom2}
      alt="Ícono de hongo"
      width={size}
      height={size}
      className={className}
      style={{ minWidth: size, minHeight: size }}
    />
  );
}
