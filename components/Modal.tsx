import React, { useState, useEffect, useRef } from "react";
import { FormElement } from "@presidenttree94/form-utils";

export default function Modal({
  heading, open, setOpen, elements, reset, handleSubmit, handleDelete
}:Readonly<{
  heading: string;
  open: boolean;
  setOpen: (open: string | null) => void;
  elements: Record<string, FormElement<string | string[]>>;
  reset: () => void;
  handleSubmit: () => void;
  handleDelete?: () => void;
}>) {

  const className = "bg-background px-2 py-1 border border-border outline-none focus:border-secondary";
  const [isValid, setIsValid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [verifyDelete, setVerifyDelete] = useState(false);

  useEffect(() => {
    if (formRef.current) {
      setIsValid(formRef.current.checkValidity());
    }
  }, [elements]);

  const handleInput = () => {
    setIsValid(formRef.current?.checkValidity() ?? false);
  }

  const handleDeleteClick = () => {
    if (verifyDelete) {
      handleDelete?.();
    } else {
      setVerifyDelete(true);
    }
  }

  return (
    <div className={`fixed inset-0 bg-black/50 z-3 ${open ? "flex" : "hidden"} justify-center items-center mb-0`}>
      <div className="card m-8 max-w-sm">
        <h3 className="text-center">{heading}</h3>
        <form ref={formRef} className="grid grid-cols-[auto_1fr] gap-4 items-center mt-4 font-body" onSubmit={(e) => { e.preventDefault(); handleSubmit(); setOpen(null); }} onChange={handleInput}>
          {Object.entries(elements).map(([key, field]) => (
            <React.Fragment key={key}>
              <label>{field.label}:</label>
              {field.options ? (
                <select {...(field.multi ? {multiple: true} : {})} className={`${className} appearance-none`} value={field.value}
                onChange={(e) => field.setValue(field.multi ? Array.from(e.target.selectedOptions, o => o.value) : e.target.value)} required={field.required}>
                  {field.defaultOption && <option disabled value="">{field.defaultOption}</option>}
                  {field.options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input type="text" className="bg-background px-2 py-1 border border-border outline-none focus:border-secondary" value={field.value} onChange={(e) => field.setValue(e.target.value)} required={field.required} />
              )}
            </React.Fragment>
          ))}
          <div className="col-span-2 grid grid-cols-2 gap-4 mt-6">
            <button type="submit" className={`${!isValid ? "bg-secondary" : "bg-primary"} text-background px-4 py-2 font-heading font-medium cursor-pointer ${handleDelete && "col-span-full"}`}>Submit</button>
            {handleDelete && <button type="button" onClick={handleDeleteClick} className={`${verifyDelete ? "bg-base" : "bg-secondary"} text-background px-4 py-2 font-heading font-medium cursor-pointer`}>Delete</button>}
            <button type="button" onClick={() => {setVerifyDelete(false); reset(); setOpen(null);}} className="bg-secondary text-background px-4 py-2 font-heading font-medium cursor-pointer">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}