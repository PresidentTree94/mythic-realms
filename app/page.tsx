import { Landmark, Swords, ScrollText, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {

  const cards = [
    {title: "Kingdoms", link: "/kingdoms", icon: Landmark, description: "Explore the various kingdoms of Mythic Realms, each with its own unique culture, history, and mythology."},
    {title: "Characters", link: "/characters", icon: Swords, description: "Discover the heroes, villains, and mythical creatures that inhabit the world of Mythic Realms."},
    {title: "Myths", link: "/myths", icon: ScrollText, description: "Delve into the rich tapestry of myths and legends that shape the lore of Mythic Realms."},
    {title: "Pantheon", link: "/pantheon", icon: Sparkles, description: "Meet the gods and goddesses of Mythic Realms, each with their own domains and representations."},
  ]

  return (
    <>
      <div className="text-center flex flex-col items-center justify-center gap-6 h-[calc(100dvh-4rem)]">
        <h1 className="w-min uppercase tracking-tighter">Mythic Realms</h1>
        <p className="text-lg md:text-xl italic font-serif font-semibold">"Where the echoes of Olympus fade into the steel of the Middle Ages."</p>
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((c, index) => 
          <Link key={index} href={c.link} className="card p-8 space-y-2 transition-transform hover:scale-105 duration-300">
            <c.icon className="h-10 w-auto text-secondary"/>
            <h4>{c.title}</h4>
            <p className="font-serif">{c.description}</p>
          </Link>
        )}
      </section>
    </>
  );
}
