import React from 'react'

export default function useWidth() {
  const [width, setWidth] = React.useState(window.innerWidth)

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width;
}