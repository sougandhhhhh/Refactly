const vulnerabilities = [
  {
    id: "CWE-79",
    title: "Unescaped provider label could enter downstream HTML surfaces",
    line: 18,
    copy: "Metadata is trusted too early. Preserve raw values for logic, but sanitize any rendered representation later in the pipeline.",
  },
  {
    id: "CWE-639",
    title: "Cache key lacks tenant isolation",
    line: 20,
    copy: "The current cache composition risks cross-organization collisions when providers overlap between accounts.",
  },
];

export function SecurityPanel() {
  return (
    <div className="space-y-4">
      {vulnerabilities.map((item) => (
        <article key={item.id} className="rounded-sm border border-cognac-muted/30 border-l-4 border-l-cognac bg-cream-50 p-5 shadow-old-money">
          <span className="inline-flex rounded-sm border border-cognac-muted/40 bg-cognac/10 px-2 py-1 font-mono text-2xs uppercase tracking-[0.16em] text-cognac-dark">
            {item.id}
          </span>
          <h3 className="mt-4 text-2xl text-charcoal-dark">{item.title}</h3>
          <p className="mt-3 text-lg leading-relaxed text-charcoal-light">{item.copy}</p>
          <p className="mt-4 font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Affected line {item.line}</p>
        </article>
      ))}
    </div>
  );
}
