import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  onClose?: () => void
}

const Alert = ({ type, title, message, onClose }: AlertProps) => {
  const styles = {
    success: {
      container: 'bg-success-50 border-success-200 text-success-800',
      icon: <CheckCircle className="w-5 h-5 text-success-600" />,
    },
    error: {
      container: 'bg-danger-50 border-danger-200 text-danger-800',
      icon: <XCircle className="w-5 h-5 text-danger-600" />,
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-600" />,
    },
  }

  const style = styles[type]

  return (
    <div className={`border rounded-lg p-4 ${style.container}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{style.icon}</div>
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert
