import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ScoreChartProps = {
  scoreHistory: Array<{ score: number; createdAt: string }>;
};

export function ScoreChart({ scoreHistory }: ScoreChartProps) {
  const chartData = scoreHistory.map((h) => ({
    label: new Date(h.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    score: h.score,
  }));

  if (chartData.length === 0) {
    return (
      <div className="card-old-money p-8 text-center">
        <p className="font-elegant text-2xl italic text-charcoal-light">
          No reviews yet. Run a review to see your score history.
        </p>
      </div>
    );
  }

  return (
    <div className="card-old-money h-full p-6">
      <h2 className="text-3xl text-charcoal-dark">Score Over Time</h2>
      <div className="mt-6 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#E0D8CC" strokeDasharray="0" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#6B6460", fontSize: 16, fontFamily: "Cormorant Garamond" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6B6460", fontSize: 12, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} domain={[50, 100]} />
            <Tooltip
              contentStyle={{ background: "#FDFCF9", border: "1px solid #E0D8CC", borderRadius: "2px", fontFamily: "EB Garamond" }}
              labelStyle={{ color: "#2C2824" }}
            />
            <Line type="monotone" dataKey="score" stroke="#A67C2E" strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 4, fill: "#A67C2E" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
