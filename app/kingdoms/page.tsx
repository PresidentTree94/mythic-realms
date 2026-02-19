import Kingdom from "@/components/Kingdom";

export default function Kingdoms() {
  return (
    <>
      <div className="mt-16 text-center">
        <h2>Realms & Echoes</h2>
        <p className="italic mt-4 font-semibold font-serif">History does not repeat itself, but it rhymes. See how the great city-states of old have been reborn in steel and stone."</p>
      </div>
      <article className="space-y-8">
        <Kingdom />
        <Kingdom />
        <Kingdom />
      </article>
    </>
  );
}