import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

import { useChartTheme } from '@/lib/chartTheme';

interface StatCardProps {
  label: string;
  value: string;
  /** Percentage change vs the previous period. Sign drives colour and arrow. */
  delta?: number;
  deltaLabel?: string;
  spark?: { value: number }[];
}

/**
 * A KPI tile.
 *
 * The delta is encoded twice — arrow direction and colour — so the reading does
 * not depend on colour alone, and the sparkline gets an area fill and an
 * emphasised final point rather than a bare line, so the trend reads at tile
 * size without axes.
 */
export function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  spark,
}: StatCardProps) {
  const chart = useChartTheme();
  const isUp = (delta ?? 0) >= 0;
  const deltaColor = isUp ? 'var(--c-success)' : 'var(--c-danger)';
  const gradientId = `spark-${label.replace(/\W/g, '')}`;

  return (
    <Card styles={{ body: { padding: 'var(--space-5)' } }}>
      <div
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--c-text-secondary)',
          marginBottom: 'var(--space-2)',
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 'var(--space-3)',
          flexWrap: 'wrap',
        }}
      >
        <strong
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </strong>

        {delta !== undefined && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              color: deltaColor,
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>

      {deltaLabel && (
        <div
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--c-text-tertiary)',
            marginTop: 'var(--space-1)',
          }}
        >
          {deltaLabel}
        </div>
      )}

      {spark && (
        <div
          style={{ height: 40, marginTop: 'var(--space-3)', marginInline: -4 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={spark}
              margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={chart.primary}
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="100%"
                    stopColor={chart.primary}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={chart.primary}
                strokeWidth={1.75}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
