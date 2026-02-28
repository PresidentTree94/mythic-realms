import React from "react";

export default function Overview({ categories }:Readonly<{ categories: { label: string, value: any }[] }>) {

  return (
    <article className="card grid grid-cols-1 @sm:grid-cols-[auto_1fr] @2xl:grid-cols-[auto_1fr_auto_1fr] items-center gap-4 text-center @sm:text-left font-body mt-8">
      {categories.map(category => (
        <React.Fragment key={category.label}>
          <span className="font-semibold font-serif">{category.label}</span>
          <span className="flex justify-center @sm:justify-start">{category.value}</span>
        </React.Fragment>
      ))}
    </article>
  );
}