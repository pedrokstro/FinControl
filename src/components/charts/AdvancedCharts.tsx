import { memo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

// ============================================
// 1. FLUXO DE CAIXA DIÁRIO
// ============================================

interface CashFlowChartProps {
  data: Array<{
    day: number;
    dailyBalance: number;
    cumulativeBalance: number;
  }>;
  formatCurrency: (value: number) => string;
}

export const CashFlowChart = memo<CashFlowChartProps>(({ data, formatCurrency }) => {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Fluxo de Caixa Diário
          </h3>
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Saldo acumulado ao longo do mês
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
          <XAxis
            dataKey="day"
            stroke="#6b7280"
            className="dark:text-neutral-400"
            tick={{ fontSize: 12 }}
            label={{ value: 'Dia do Mês', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            stroke="#6b7280"
            className="dark:text-neutral-400"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}k`;
              return `R$ ${value}`;
            }}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="cumulativeBalance"
            stroke="#0ea5e9"
            strokeWidth={3}
            fill="url(#colorCumulative)"
            fillOpacity={1}
            name="Saldo Acumulado"
            dot={{ fill: '#0ea5e9', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

CashFlowChart.displayName = 'CashFlowChart';

// ============================================
// 2. TOP 10 MAIORES DESPESAS
// ============================================

interface TopExpensesChartProps {
  data: Array<{
    description: string;
    amount: number;
    category: string;
  }>;
  formatCurrency: (value: number) => string;
}

export const TopExpensesChart = memo<TopExpensesChartProps>(({ data, formatCurrency }) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: '#f59e0b',
      transport: '#3b82f6',
      entertainment: '#ec4899',
      shopping: '#8b5cf6',
      health: '#ef4444',
      education: '#10b981',
      bills: '#6366f1',
      others: '#6b7280',
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
          <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top 10 Maiores Despesas
          </h3>
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Transações que mais impactaram seu orçamento
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 100, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
          <XAxis
            type="number"
            stroke="#6b7280"
            className="dark:text-neutral-400"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <YAxis
            type="category"
            dataKey="description"
            stroke="#6b7280"
            className="dark:text-neutral-400"
            tick={{ fontSize: 11 }}
            width={90}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="amount" name="Valor" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

TopExpensesChart.displayName = 'TopExpensesChart';

// ============================================
// 3. TAXA DE POUPANÇA
// ============================================

interface SavingsRateChartProps {
  data: {
    income: number;
    expense: number;
    savings: number;
    savingsRate: number;
    goal: number;
  };
  formatCurrency: (value: number) => string;
}

export const SavingsRateChart = memo<SavingsRateChartProps>(({ data, formatCurrency }) => {
  const { savingsRate, goal } = data;
  const percentage = Math.min(100, Math.max(0, savingsRate));
  const isGood = savingsRate >= goal;
  const isWarning = savingsRate >= goal * 0.7 && savingsRate < goal;

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isGood ? 'bg-green-50 dark:bg-green-900/20' : 
          isWarning ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
          'bg-red-50 dark:bg-red-900/20'
        }`}>
          {isGood ? (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          ) : (
            <AlertTriangle className={`w-5 h-5 ${
              isWarning ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
            }`} />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Taxa de Poupança
          </h3>
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Meta: {goal}% da receita
          </p>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="relative w-full h-16 bg-gray-100 dark:bg-neutral-800 rounded-lg overflow-hidden mb-6">
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-500 ${
            isGood ? 'bg-gradient-to-r from-green-500 to-green-600' :
            isWarning ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
            'bg-gradient-to-r from-red-500 to-red-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white z-10">
            {savingsRate.toFixed(1)}%
          </span>
        </div>
        {/* Linha da meta */}
        <div
          className="absolute top-0 h-full w-1 bg-gray-900 dark:bg-white opacity-50"
          style={{ left: `${goal}%` }}
        />
      </div>

      {/* Resumo financeiro */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-neutral-400 mb-1">Receitas</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            {formatCurrency(data.income)}
          </p>
        </div>
        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-neutral-400 mb-1">Despesas</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            {formatCurrency(data.expense)}
          </p>
        </div>
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-neutral-400 mb-1">Economia</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(data.savings)}
          </p>
        </div>
      </div>
    </div>
  );
});

SavingsRateChart.displayName = 'SavingsRateChart';

// ============================================
// 4. DESPESAS POR DIA DA SEMANA
// ============================================

interface ExpensesByWeekdayChartProps {
  data: Array<{
    weekday: string;
    total: number;
  }>;
  formatCurrency: (value: number) => string;
}

export const ExpensesByWeekdayChart = memo<ExpensesByWeekdayChartProps>(({ data, formatCurrency }) => {
  const maxValue = Math.max(...data.map(d => d.total));

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Despesas por Dia da Semana
          </h3>
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Identifique padrões de consumo
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
          <XAxis
            dataKey="weekday"
            stroke="#6b7280"
            className="dark:text-neutral-400"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke="#6b7280"
            className="dark:text-neutral-400"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="total" name="Despesas" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.total === maxValue ? '#ef4444' : '#f59e0b'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

ExpensesByWeekdayChart.displayName = 'ExpensesByWeekdayChart';

// ============================================
// 5. ORÇAMENTO VS REAL
// ============================================

interface BudgetVsActualChartProps {
  data: Array<{
    category: string;
    budget: number;
    actual: number;
    status: 'good' | 'warning' | 'over';
  }>;
  formatCurrency: (value: number) => string;
}

export const BudgetVsActualChart = memo<BudgetVsActualChartProps>(({ data, formatCurrency }) => {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Orçamento vs Real
          </h3>
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Comparação por categoria
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 100, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
          <XAxis
            type="number"
            stroke="#6b7280"
            className="dark:text-neutral-400"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <YAxis
            type="category"
            dataKey="category"
            stroke="#6b7280"
            className="dark:text-neutral-400"
            tick={{ fontSize: 11 }}
            width={90}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="budget" fill="#94a3b8" name="Orçamento" radius={[0, 4, 4, 0]} />
          <Bar dataKey="actual" name="Real" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.status === 'good' ? '#22c55e' :
                  entry.status === 'warning' ? '#f59e0b' :
                  '#ef4444'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legenda de status */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-600 dark:text-neutral-400">Dentro do orçamento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-sm text-gray-600 dark:text-neutral-400">Atenção (90%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-600 dark:text-neutral-400">Acima do orçamento</span>
        </div>
      </div>
    </div>
  );
});

BudgetVsActualChart.displayName = 'BudgetVsActualChart';
