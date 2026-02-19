import Character from "@/components/Character";

export default function Characters() {
  return (
    <>
      <div className="mt-16 text-center">
        <h2>Dramatis Personae</h2>
        <p className="italic mt-4 font-semibold font-serif">"Heroes are not born; they are forged in the fires of tragedy and triumph."</p>
      </div>
      <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Character />
        <Character />
        <Character />
        <Character />
        <Character />
        <Character />
        <Character />
        <Character />
      </article>
    </>
  );
}