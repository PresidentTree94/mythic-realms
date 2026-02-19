export default function Myth() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary"></div>
      <div className="p-6">
        <h3>Myth Title</h3>
        <p className="font-serif mt-2">Short summary of the myth.</p>
        <div className="border-t border-border/50 pt-4 mt-4 font-body">
          <p className="text-xs font-bold uppercase tracking-widest">Key Figures</p>
          <div className="flex flex-wrap gap-2 text-xs font-medium mt-2">
            <span className="px-2 py-1 bg-secondary/20 rounded">Character</span>
          </div>
        </div>
      </div>
    </div>
  );
}