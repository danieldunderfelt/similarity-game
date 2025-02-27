import { cn } from '../lib/utils'

export interface TextComparisonProps {
  text1: string
  text2: string
  className?: string
}

export default function TextComparison({ text1, text2, className }: TextComparisonProps) {
  return (
    <div className={cn('my-6 flex w-full flex-row items-start justify-between gap-6', className)}>
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
          1
        </div>
        <div className="font-medium text-2xl text-gray-800 leading-relaxed">{text1}</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600">
          2
        </div>
        <div className="font-medium text-2xl text-gray-800 leading-relaxed">{text2}</div>
      </div>
    </div>
  )
}
