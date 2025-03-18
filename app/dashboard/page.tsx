// app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function DashboardPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchBusinesses = async () => {
      const { data } = await supabase
        .from('businesses')
        .select('id, name, slug, description')
      
      setBusinesses(data || [])
    }
    fetchBusinesses()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">商家管理</h1>
      <div className="grid grid-cols-1 gap-4">
        {businesses.map((business) => (
          <div key={business.id} className="p-4 border rounded">
            <h2 className="text-xl font-semibold">{business.name}</h2>
            <p className="text-gray-600">{business.description}</p>
            <button
              onClick={() => router.push(`/biz/${business.slug}`)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              查看详情
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}