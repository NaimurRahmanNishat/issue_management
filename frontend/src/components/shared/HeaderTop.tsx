import { useEffect, useRef } from 'react'

const data = [
  {
    id: 1,
    title: "If there is a problem anywhere in your area, please report it on our website for quick assistance.",
  },
  {
    id: 2,
    title: "Facing any issues in your locality? Let us know through our website and we will take action immediately.",
  },
  {
    id: 3,
    title: "Notice a problem in your neighborhood? Submit a report on our website to help us resolve it faster.",
  },
];

const HeaderTop = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return
    let scrollAmount = 0
    const scrollSpeed = 0.5 

    const scroll = () => {
      scrollAmount += scrollSpeed
      if (scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0
      }
      scrollContainer.style.transform = `translateX(-${scrollAmount}px)`
      requestAnimationFrame(scroll)
    }
    const animationId = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div className="h-10 bg-[#c4eecb] text-sm font-medium flex items-center overflow-hidden">
      <div ref={scrollRef} className="flex items-center gap-8 whitespace-nowrap">
        {[...data, ...data].map((item, index) => (
          <p key={`${item.id}-${index}`} className="px-4">
            {item.title}
          </p>
        ))}
      </div>
    </div>
  )
}

export default HeaderTop