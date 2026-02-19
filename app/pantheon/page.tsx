import Patron from "@/components/Patron";

export default function Pantheon() {
  return (
    <>
      <div className="mt-16 text-center">
        <h2>Pantheon</h2>
        <p className="italic mt-4 font-semibold font-serif">Quote goes here.</p>
      </div>
      <article className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <Patron />
        <Patron />
        <Patron />
        <Patron />
        <Patron />
        <Patron />
        <Patron />
        <Patron />
      </article>
    </>
  );
}