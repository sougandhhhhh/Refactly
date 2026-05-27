import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const complexityData = [
  { name: "reviewSubmission", value: 9 },
  { name: "groupFindings", value: 6 },
  { name: "scoreSession", value: 4 },
];

export function ComplexityPanel() {
  return (
    <div className="space-y-6">
      <div className="card-old-money p-6">
        <p className="eyebrow">Complexity Profile</p>
        <div className="mt-5 flex gap-8">
          <div>
            <p className="font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Time</p>
            <p className="font-display text-6xl text-charcoal-dark">O(n²)</p>
          </div>
          <div>
            <p className="font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Space</p>
            <p className="font-display text-6xl text-charcoal-dark">O(1)</p>
          </div>
        </div>
      </div>
      <div className="card-old-money h-[260px] p-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={complexityData}>
            <CartesianGrid stroke="#E0D8CC" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#6B6460", fontSize: 12, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6B6460", fontSize: 14, fontFamily: "Cormorant Garamond" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#FDFCF9", border: "1px solid #E0D8CC", borderRadius: "2px" }} />
            <Bar dataKey="value" fill="#A67C2E" radius={0} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
