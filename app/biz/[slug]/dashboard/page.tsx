'use client'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

interface Business {
  id: string
  name: string
  status: 'pending' | 'approved'
}

export default function Dashboard() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('businesses')
        .select('id, name, status')
        .eq('owner_id', user.id)

      setBusinesses(data || [])
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">我的商家</h1>
      
      <div className="space-y-4">
        {businesses.map(biz => (
          <div key={biz.id} className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">{biz.name}</h2>
            <p className={`mt-2 ${
              biz.status === 'approved' 
                ? 'text-green-600' 
                : 'text-yellow-600'
            }`}>
              状态：{biz.status === 'approved' ? '已通过' : '审核中'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}