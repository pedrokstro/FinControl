import { memo } from 'react'
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

// ============================================
// GRÁFICO DE BARRAS MEMOIZADO
// ============================================

interface BarChartData {
  month: string
  receitas: number
  despesas: number
  saldo: number
}

interface MemoizedBarChartProps {
  data: BarChartData[]
  formatCurrency: (value: number) => string
}

export const MemoizedBarChart = memo<MemoizedBarChartProps>(
  ({ data, formatCurrency }) => {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            className="dark:text-neutral-400"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#6b7280"
            className="dark:text-neutral-400"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              if (value >= 1000) {
                return `R$ ${(value / 1000).toFixed(0)}k`
              }
              return `R$ ${value}`
            }}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            animationDuration={300}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
          />
          <Bar 
            dataKey="receitas" 
            fill="#22c55e" 
            name="Receitas"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
          <Bar 
            dataKey="despesas" 
            fill="#ef4444" 
            name="Despesas"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    )
  },
  (prevProps, nextProps) => {
    // Comparação customizada para evitar re-renders desnecessários
    return (
      prevProps.data.length === nextProps.data.length &&
      prevProps.data.every((item, index) => 
        item.month === nextProps.data[index].month &&
        item.receitas === nextProps.data[index].receitas &&
        item.despesas === nextProps.data[index].despesas
      )
    )
  }
)

MemoizedBarChart.displayName = 'MemoizedBarChart'

// ============================================
// GRÁFICO DE ÁREA MEMOIZADO
// ============================================

interface AreaChartData {
  month: string
  receitas: number
  despesas: number
}

interface MemoizedAreaChartProps {
  data: AreaChartData[]
  formatCurrency: (value: number) => string
}

export const MemoizedAreaChart = memo<MemoizedAreaChartProps>(
  ({ data, formatCurrency }) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            className="dark:text-neutral-400"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#6b7280"
            className="dark:text-neutral-400"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              if (value >= 1000) {
                return `R$ ${(value / 1000).toFixed(0)}k`
              }
              return `R$ ${value}`
            }}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="receitas"
            stroke="#22c55e"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorReceitas)"
            name="Receitas"
            animationDuration={800}
            animationBegin={0}
            isAnimationActive={true}
          />
          <Area
            type="monotone"
            dataKey="despesas"
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorDespesas)"
            name="Despesas"
            animationDuration={800}
            animationBegin={100}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.data.length === nextProps.data.length &&
      prevProps.data.every((item, index) => 
        item.month === nextProps.data[index].month &&
        item.receitas === nextProps.data[index].receitas &&
        item.despesas === nextProps.data[index].despesas
      )
    )
  }
)

MemoizedAreaChart.displayName = 'MemoizedAreaChart'

// ============================================
// GRÁFICO DE PIZZA MEMOIZADO
// ============================================

interface PieChartData {
  name: string
  value: number
  color: string
}

interface MemoizedPieChartProps {
  data: PieChartData[]
  formatCurrency: (value: number) => string
}

export const MemoizedPieChart = memo<MemoizedPieChartProps>(
  ({ data, formatCurrency }) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1000}
            animationBegin={0}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.data.length === nextProps.data.length &&
      prevProps.data.every((item, index) => 
        item.name === nextProps.data[index].name &&
        item.value === nextProps.data[index].value &&
        item.color === nextProps.data[index].color
      )
    )
  }
)

MemoizedPieChart.displayName = 'MemoizedPieChart'
