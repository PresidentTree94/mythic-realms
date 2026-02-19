export default function Kingdom() {
  return (
    <div className="card space-y-4">
      <h2 className="text-center text-3xl">Kingdom Name</h2>
      <div className="grid grid-cols-[1fr_3rem_1fr] items-center gap-4 font-serif text-xs uppercase tracking-widest">
        <span className="text-right">Legacy</span>
        <span className="w-12 h-[1px] bg-border"></span>
        <span>Successor</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="text-center md:text-right space-y-4">
          <h3>Greek</h3>
          <p className="font-body italic text-sm">Founded by Name, relation.</p>
          <p className="font-body italic text-sm">Located in Region, Country.</p>
        </div>
        <div className="text-center md:text-left space-y-4">
          <h3>Medieval</h3>
          <p className="font-body italic text-sm">Founded by Name, relation.</p>
          <p className="font-body italic text-sm">Located in Region, Country.</p>
        </div>
      </div>
    </div>
  );
}