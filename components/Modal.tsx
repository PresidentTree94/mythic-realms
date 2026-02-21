import React from "react";

export default function Modal({
  heading, open, setOpen, elements, handleSubmit, disabled
}:Readonly<{
  heading: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  elements: Record<string, any>;
  handleSubmit: React.SubmitEventHandler<HTMLFormElement>;
  disabled: boolean;
}>) {

  return (
    <div className={`fixed inset-0 bg-black/50 z-3 ${open ? "flex" : "hidden"} justify-center items-center mb-0`}>
      <div className="card m-8 max-w-sm">
        <h3 className="text-center">{heading}</h3>
        <form className="grid grid-cols-[auto_1fr] gap-4 items-center mt-4 font-body" onSubmit={handleSubmit}>
          {Object.entries(elements).map(([key, field]) => (
            <React.Fragment key={key}>
              <label>{field.label}:</label>
              {field.options ? (
                <select key={field.isMulti ? "multi" : "single"} {...(field.isMulti ? {multiple: true} : {})} className="bg-background px-2 py-1 border border-border outline-none focus:border-secondary appearance-none" value={field.value}
                onChange={(e) => field.setValue(field.isMulti ? Array.from(e.target.selectedOptions, o => o.value) : e.target.value)}>
                  <option value="">{field.defaultOption}</option>
                  {field.options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input type="text" className="bg-background px-2 py-1 border border-border outline-none focus:border-secondary" value={field.value} onChange={(e) => field.setValue(e.target.value)} />
              )}
            </React.Fragment>
          ))}
          <div className="col-span-2 grid grid-cols-2 gap-4 mt-6">
            <button type="submit" disabled={disabled} className={`${disabled ? "bg-secondary" : "bg-primary"} text-background px-4 py-2 font-heading font-medium cursor-pointer`}>Submit</button>
            <button type="button" onClick={() => setOpen(false)} className="bg-secondary text-background px-4 py-2 font-heading font-medium cursor-pointer">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}