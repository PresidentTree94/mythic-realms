import { Landmark, Swords, ScrollText } from "lucide-react";

export default function Home() {

  const cards = [
    {title: "Kingdoms", icon: Landmark, description: "Explore the various kingdoms of Mythic Realms, each with its own unique culture, history, and mythology."},
    {title: "Characters", icon: Swords, description: "Discover the heroes, villains, and mythical creatures that inhabit the world of Mythic Realms."},
    {title: "Myths", icon: ScrollText, description: "Delve into the rich tapestry of myths and legends that shape the lore of Mythic Realms."},
  ]

  return (
    <>
      <div className="text-center flex flex-col items-center justify-center gap-6 h-[calc(100dvh-4rem)]">
        <h1 className="w-min uppercase tracking-tighter">Mythic Realms</h1>
        <p className="text-lg md:text-xl italic font-serif font-semibold">"Where the echoes of Olympus fade into the steel of the Middle Ages."</p>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card) => 
          <div key={card.title} className="card p-8 space-y-2 transition-transform hover:scale-105 duration-300">
            <card.icon className="h-10 w-auto text-secondary"/>
            <h3>{card.title}</h3>
            <p className="font-serif">{card.description}</p>
          </div>
        )}
      </section>
    </>
  );
}
