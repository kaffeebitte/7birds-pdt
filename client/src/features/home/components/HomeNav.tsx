import { Link } from "react-router-dom";
import { homeLinks } from "../data/mockHome";

export function HomeNav() {
  return (
    <>
      {homeLinks.map((link) => (
        <Link
          key={link.label}
          to={link.href}
          className={`home-link ${link.position}`}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}
