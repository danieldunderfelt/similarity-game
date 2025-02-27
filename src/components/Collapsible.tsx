import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'

interface CollapsibleProps {
  children: React.ReactNode
  previewHeight?: number // Height in pixels to show when collapsed
  defaultExpanded?: boolean
  buttonClassName?: string
  onToggle?: (isExpanded: boolean) => void
}

export default function Collapsible({
  children,
  previewHeight = 100,
  defaultExpanded = false,
  buttonClassName = '',
  onToggle,
}: CollapsibleProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined)
  const contentRef = useRef<HTMLDivElement>(null)

  // Measure the full content height when content changes or on window resize
  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight)
      }
    }

    // Initial measurement
    updateHeight()

    // Add resize listener
    window.addEventListener('resize', updateHeight)

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateHeight)
    }
  }, [children])

  const toggleExpand = () => {
    const newState = !isExpanded
    setIsExpanded(newState)
    onToggle?.(newState)
  }

  // Only apply collapsing if content is taller than previewHeight
  const shouldCollapse = contentHeight !== undefined && contentHeight > previewHeight

  return (
    <div className="flex flex-col">
      {/* Content container */}
      <div className="relative overflow-hidden">
        <motion.div
          ref={contentRef}
          initial={false}
          animate={{
            height: isExpanded || !shouldCollapse ? contentHeight : previewHeight,
          }}
          transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          className="overflow-hidden">
          {children}
        </motion.div>

        {/* Gradient overlay when collapsed - limited to content area only */}
        {!isExpanded && shouldCollapse && (
          <div
            className="pointer-events-none absolute right-0 bottom-0 left-0 h-12 bg-gradient-to-t from-slate-50/90 to-transparent"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Button container - separate from content area */}
      {shouldCollapse && (
        <div className="mt-2 flex justify-center">
          <Button
            type="button"
            variant="link"
            onClick={toggleExpand}
            className={cn(
              'flex items-center gap-1 font-medium text-blue-600 text-sm transition-colors hover:text-blue-800 focus:outline-none',
              buttonClassName,
            )}
            aria-expanded={isExpanded}
            aria-controls="collapsible-content">
            {isExpanded ? (
              <>
                Show Less
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </>
            ) : (
              <>
                Show More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
