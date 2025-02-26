export interface TextComparisonProps {
  text1: string
  text2: string
}

export default function TextComparison({ text1, text2 }: TextComparisonProps) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Text 1</h2>
        <div className="bg-gray-50 p-4 rounded-md text-gray-800 min-h-[150px]">{text1}</div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Text 2</h2>
        <div className="bg-gray-50 p-4 rounded-md text-gray-800 min-h-[150px]">{text2}</div>
      </div>
    </div>
  )
}
