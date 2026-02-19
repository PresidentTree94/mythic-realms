export default function Character() {
  return (
    <div className="relative rounded-xl overflow-hidden aspect-21/32 shadow group">
      <img src="/warrior.png" className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-6">
        <h3 className="text-white">Character Name</h3>
        <p className="font-body text-secondary italic text-sm border-l-2 border-secondary pl-2">Inspired by Mythology</p>
      </div>
    </div>
  );
}