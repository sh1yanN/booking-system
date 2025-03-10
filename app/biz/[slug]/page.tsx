// app/biz/[slug]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Calendar from '@/components/Calendar'

interface Business {
  id: string;
  name: string;
  slug: string;
  open_hours?: Record<string, string[]>;
}

export default function BizPage() {
  const { slug } = useParams<{ slug: string }>()
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase
          .from('businesses')
          .select('*')
          .eq('slug', slug)
          .single<Business>()
        
        setBusiness(data)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="h-8 bg-gray-200 rounded w-[200px] mb-8 animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">
        {business?.name || "未命名商家"}
      </h1>
      {business && (
        <Calendar 
          businessId={business.id}
        />
      )}
    </div>
  )
}