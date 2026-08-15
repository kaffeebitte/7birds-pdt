import { Link } from "react-router-dom";

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <Link to="/home" className={`brand-logo ${className}`}>
      piditi birds
    </Link>
  );
}
