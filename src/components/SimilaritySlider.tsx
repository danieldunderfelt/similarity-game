import { type ChangeEvent, useState } from 'react'

interface SimilaritySliderProps {
  value: number
  onChange: (value: number) => void
  onSubmit: () => void
}

export default function SimilaritySlider({ value, onChange, onSubmit }: SimilaritySliderProps) {
  const [displayValue, setDisplayValue] = useState(value.toFixed(3))

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseFloat(e.target.value)
    onChange(newValue)
    setDisplayValue(newValue.toFixed(3))
  }

  // Calculate background gradient for the slider
  const percentage = (value / 10) * 100
  const background = `linear-gradient(to right, #6366f1 0%, #8b5cf6 ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`

  // Add a style tag for the slider thumb
  const styleTag = document.createElement('style')
  styleTag.textContent = `
    /* Slider thumb styles for WebKit browsers (Chrome, Safari) */
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      cursor: pointer;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      margin-top: -5px;
      transition: all 0.2s ease;
    }
    
    input[type=range]::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    }
    
    /* Slider thumb styles for Firefox */
    input[type=range]::-moz-range-thumb {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      cursor: pointer;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
    }
    
    input[type=range]::-moz-range-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    }
  `
  document.head.appendChild(styleTag)

  return (
    <div className="mx-auto mt-10 mb-12 flex w-full max-w-5xl flex-col items-center gap-4">
      <div className="flex w-full flex-col items-center gap-10 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-6xl text-transparent tabular-nums">
          {displayValue}
        </div>
        <div className="flex w-full justify-between font-medium text-gray-600 text-lg">
          <span className="ml-2">Not similar at all</span>
          <span className="mr-2">Synonymous</span>
        </div>
      </div>

      <div className="w-full space-y-6 rounded-2xl bg-gray-100 px-4 py-6 shadow-inner">
        <input
          type="range"
          min="0"
          max="10"
          step="0.001"
          value={value}
          onChange={handleChange}
          className="h-6 w-full cursor-pointer appearance-none rounded-full"
          style={{
            background,
            WebkitAppearance: 'none',
          }}
        />

        <div className="flex justify-between px-2 font-medium text-gray-600 text-sm">
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
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 font-bold text-white text-xl shadow-lg transition duration-300 ease-in-out hover:translate-y-[-2px] hover:shadow-xl">
        Submit Rating
      </button>
    </div>
  )
}
