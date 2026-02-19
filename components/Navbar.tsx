"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Landmark, Swords, ScrollText } from "lucide-react";

export default function Navbar() {

  const pathname = usePathname();
  
  const links = [
    {label: "Kingdoms", link: "/kingdoms", icon: Landmark},
    {label: "Characters", link: "/characters", icon: Swords},
    {label: "Myths", link: "/myths", icon: ScrollText},
  ];

  return (
    <header className="fixed w-full top-0 h-16 grid grid-cols-[1fr_3fr] sm:grid-cols-[1fr_auto] sm:items-center sm:p-4 bg-background/95 border-b border-border backdrop-blur z-1">
      <Link href="/" className="font-heading font-bold text-xl tracking-wider text-primary uppercase flex items-center justify-center sm:justify-start"><span className="sm:hidden">MR</span><span className="hidden sm:inline">Mythic Realms</span></Link>
      <nav className="text-sm font-body font-medium grid grid-cols-3 sm:grid-cols-[repeat(3,auto)] sm:gap-6">
        {links.map((l, index) =>
          <Link key={index} href={l.link} className={`flex items-center justify-center gap-2 hover:text-primary transition-colors ${pathname === l.link && "text-primary"}`}>{l.icon && <l.icon className="sm:hidden h-5 w-auto" />}<span className="hidden sm:inline">{l.label}</span></Link>
        )}
      </nav>
    </header>
  );
}