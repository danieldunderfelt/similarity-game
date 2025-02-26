import { type ChangeEvent, useState } from 'react'

interface SimilaritySliderProps {
  value: number
  onChange: (value: number) => void
  onSubmit: () => void
}

export default function SimilaritySlider({ value, onChange, onSubmit }: SimilaritySliderProps) {
  const [displayValue, setDisplayValue] = useState(value.toFixed(1))

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseFloat(e.target.value)
    onChange(newValue)
    setDisplayValue(newValue.toFixed(1))
  }

  // Calculate background gradient for the slider
  const percentage = (value / 10) * 100
  const background = `linear-gradient(to right, #3498db 0%, #3498db ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`

  return (
    <div className="w-full max-w-lg mx-auto mt-8 mb-8">
      <div className="text-center mb-6">
        <div className="text-4xl font-bold mb-2">{displayValue}</div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Not similar at all</span>
          <span>Synonymous</span>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max="10"
        step="0.1"
        value={value}
        onChange={handleChange}
        className="w-full h-3 rounded-lg appearance-none cursor-pointer"
        style={{
          background,
          WebkitAppearance: 'none',
        }}
      />

      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>0</span>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
        <span>7</span>
        <span>8</span>
        <span>9</span>
        <span>10</span>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="w-full mt-8 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out">
        Submit Rating
      </button>
    </div>
  )
}
