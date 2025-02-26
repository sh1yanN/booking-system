'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { addDays, format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

// 明确定义 Slot 类型
interface Slot {
  id: string
  business_id: string
  start_time: string
  duration: string
  capacity: number
}

export default function Calendar({ businessId }: { businessId: string }) {
  const [date, setDate] = useState(new Date())
  const [slots, setSlots] = useState<Slot[]>([]) // 应用严格类型
  const supabase = createClient()

  // 修复依赖项问题
  useEffect(() => {
    const fetchSlots = async () => {
      const start = date
      const end = addDays(date, 7)
      
      const { data } = await supabase
        .from('slots')
        .select('*')
        .eq('business_id', businessId)
        .gte('start_time', start.toISOString())
        .lte('start_time', end.toISOString())

      setSlots(data || [])
    }

    fetchSlots()
  }, [date, businessId, supabase]) // ✅ 正确依赖项

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <CalendarIcon className="h-5 w-5" />
        <input
          type="date"
          value={format(date, 'yyyy-MM-dd')}
          onChange={(e) => setDate(new Date(e.target.value))}
          className="p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {slots.map((slot) => (
          <button
            key={slot.id}
            className="p-4 border rounded hover:bg-blue-50"
            onClick={() => {/* 处理预约 */}}
          >
            {format(new Date(slot.start_time), 'HH:mm')}
          </button>
        ))}
      </div>
    </div>
  )
}