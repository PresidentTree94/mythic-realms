import Myth from "@/components/Myth";

export default function Myths() {
  return (
    <>
      <div className="mt-16 text-center">
        <h2>The Chronicles</h2>
        <p className="italic mt-4 font-semibold font-serif">"Legends are but truths that time has forgotten."</p>
      </div>
      <article className="columns-1 md:columns-2 lg:columns-3 space-y-8 gap-8">
        <Myth />
        <Myth />
        <Myth />
      </article>
    </>
  );
}