import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase'
import { getUserSettings } from '@/services/gamificationService'

export function useUserStats() {
  const [userId, setUserId] = useState<string | null>(null)
  const [stats, setStats] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession()
      const uid = data.session?.user?.id || null
      setUserId(uid)
      if (uid) {
        const s = await getUserSettings(uid)
        setStats(s)
      }
      setLoading(false)
    })()
  }, [])

  return { userId, stats, loading, refresh: async () => { if (!userId) return; setStats(await getUserSettings(userId)) } }
}


