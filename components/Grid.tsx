import React from "react";
import { Char } from "@/types/char";
import { My } from "@/types/my";
import { King } from "@/types/king";

export default function Grid<T extends Char | My | King>({
  title, quote, button, gridStyle, data, dataComponent: DataComponent, children
}:Readonly<{
  title: string,
  quote: string,
  button: { label: string, onClick: () => void },
  gridStyle?: string,
  data: T[],
  dataComponent: React.ComponentType<{ data: T }>,
  children: React.ReactNode,
}>) {
  return (
    <>
      <div className="mt-16 text-center">
        <h2>{title}</h2>
        <p className="italic mt-4 font-semibold font-serif">"{quote}"</p>
      </div>
      <div className="text-center">
        <button onClick={button.onClick} className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer">{button.label}</button>
      </div>
      <article className={`grid grid-cols-1 ${gridStyle} gap-8`}>
        {data.map(item => (
          <DataComponent key={item.id} data={item} />
        ))}
      </article>
      {children}
    </>
  );
}