
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check on mount
    checkMobile()
    
    // Add event listener with throttling for performance
    let timeout: number | null = null
    const handleResize = () => {
      if (timeout) window.clearTimeout(timeout)
      timeout = window.setTimeout(() => {
        checkMobile()
      }, 150)
    }
    
    window.addEventListener("resize", handleResize)
    
    // Also check on orientation change for mobile devices
    window.addEventListener("orientationchange", checkMobile)
    
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", checkMobile)
      if (timeout) window.clearTimeout(timeout)
    }
  }, [])

  return !!isMobile
}
