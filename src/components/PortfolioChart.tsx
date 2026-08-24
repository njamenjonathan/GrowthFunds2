import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export interface ChartPoint {
  month: string;
  invested: number;
  yield: number;
}

/**
 * Isolated so the charting library can be code-split: it is only needed once a
 * signed-in user reaches the dashboard, not on the landing page.
 */
export default function PortfolioChart({ data }: { data: ChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--gf-accent)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--gf-accent)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--gf-gold-3)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--gf-gold-3)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={16} />
        <YAxis
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
        />
        <Tooltip
          cursor={{ stroke: 'var(--gf-line)' }}
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <div className="bg-emerald text-on-emerald p-3 rounded-xl border border-gold/40 shadow-xl text-xs font-mono">
                <p className="text-gold font-bold mb-1">{label}</p>
                <p>Invested: {Number(payload[0]?.value ?? 0).toLocaleString()} XAF</p>
                <p className="text-emerald-tint">Yield: +{Number(payload[1]?.value ?? 0).toLocaleString()} XAF</p>
              </div>
            ) : null
          }
        />
        <Area
          type="monotone"
          dataKey="invested"
          name="Invested"
          stroke="var(--gf-accent)"
          strokeWidth={2.5}
          fill="url(#growthGrad)"
          activeDot={{ r: 5, fill: 'var(--gf-gold)', stroke: 'var(--gf-accent)', strokeWidth: 2 }}
        />
        <Area
          type="monotone"
          dataKey="yield"
          name="Accrued yield"
          stroke="var(--gf-gold-3)"
          strokeWidth={2}
          strokeDasharray="4 4"
          fill="url(#yieldGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
