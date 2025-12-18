import { useEffect, useState } from 'react'
import { Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const CurrentDateCard = () => {
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
          <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">
            Hoje
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {format(currentDateTime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
          <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">
            Horário Atual
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
            {format(currentDateTime, 'HH:mm:ss')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CurrentDateCard
