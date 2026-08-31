import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/** 旧 /resume 链接重定向到首页简历区块 */
export function ResumeRedirectPage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/', { replace: true })
    requestAnimationFrame(() => {
      document.getElementById('resume')?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [navigate])

  return null
}
