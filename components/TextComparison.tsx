export interface TextComparisonProps {
  text1: string
  text2: string
}

export default function TextComparison({ text1, text2 }: TextComparisonProps) {
  return (
    <div className="w-full grid grid-cols-2 gap-8 mt-10">
      <div className="p-8 bg-white rounded-xl shadow-lg border border-blue-50 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
          <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
            1
          </span>
          Text One
        </h2>
        <div className="bg-blue-50 p-6 rounded-lg text-gray-800 min-h-[180px] text-lg leading-relaxed font-medium border-l-4 border-blue-300">
          {text1}
        </div>
      </div>

      <div className="p-8 bg-white rounded-xl shadow-lg border border-purple-50 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
          <span className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
            2
          </span>
          Text Two
        </h2>
        <div className="bg-purple-50 p-6 rounded-lg text-gray-800 min-h-[180px] text-lg leading-relaxed font-medium border-l-4 border-purple-300">
          {text2}
        </div>
      </div>
    </div>
  )
}
