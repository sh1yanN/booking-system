'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { addDays, format, isPast } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

// 明确定义接口类型
interface Slot {
  id: string
  business_id: string
  start_time: string  // 实际存储的是ISO格式字符串
  duration: string
  capacity: number
}

interface Reservation {
  id: string
  slot_id: string
  user_id: string
}

export default function Calendar({ businessId }: { businessId: string }) {
  const router = useRouter()
  const supabase = createClient()  // 正确初始化Supabase客户端
  const [date, setDate] = useState(new Date())
  const [slots, setSlots] = useState<Slot[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)  // 修正类型

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      const start = date
      const end = addDays(date, 7)
      
      // 获取时间段
      const { data: slotsData } = await supabase
        .from('slots')
        .select('*')
        .eq('business_id', businessId)
        .gte('start_time', start.toISOString())
        .lte('start_time', end.toISOString())

      // 获取当前用户的预约
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: reservationsData } = await supabase
          .from('reservations')
          .select('id, slot_id, user_id')
          .eq('user_id', user.id)
        
        setReservations(reservationsData || [])
      }

      setSlots(slotsData || [])
    }

    fetchData()
  }, [date, businessId, supabase])

  // 处理预约点击
  const handleSlotClick = (slot: Slot) => {
    if (isSlotAvailable(slot)) {
      setSelectedSlot(slot)
    }
  }

  // 确认预约
  const confirmReservation = async () => {
    if (!selectedSlot) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    try {
      // 使用事务处理预约
      const { error } = await supabase.rpc('create_reservation', {
        slot_id: selectedSlot.id,
        user_id: user.id
      })

      if (error) throw error

      // 更新本地状态
      setReservations([...reservations, {
        id: crypto.randomUUID(),
        slot_id: selectedSlot.id,
        user_id: user.id
      }])
      
      setSelectedSlot(null)
      alert('预约成功!')
    } catch (error) {
      alert(`预约失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  // 检查时段可用性
  const isSlotAvailable = (slot: Slot) => {
    const slotTime = new Date(slot.start_time)
    return (
      !isPast(slotTime) &&
      slot.capacity > 0 &&
      !reservations.some(r => r.slot_id === slot.id)
    )
  }

  return (
    <div className="relative">
      {/* 日期选择器 */}
      <div className="flex items-center gap-2 mb-4">
        <CalendarIcon className="h-5 w-5" />
        <input
          type="date"
          value={format(date, 'yyyy-MM-dd')}
          onChange={(e) => setDate(new Date(e.target.value))}
          className="p-2 border rounded"
          min={format(new Date(), 'yyyy-MM-dd')}
        />
      </div>

      {/* 时段列表 */}
      <div className="grid grid-cols-2 gap-4">
        {slots.map((slot) => {
          const slotTime = new Date(slot.start_time)
          const available = isSlotAvailable(slot)

          return (
            <button
              key={slot.id}
              onClick={() => handleSlotClick(slot)}
              className={`p-4 border rounded transition-colors ${
                available 
                  ? 'hover:bg-blue-50 cursor-pointer' 
                  : 'bg-gray-100 cursor-not-allowed'
              } ${isPast(slotTime) && 'opacity-50'}`}
              disabled={!available}
            >
              <div className="text-left">
                <div className="font-medium">
                  {format(slotTime, 'HH:mm')}
                </div>
                <div className="text-sm text-gray-500">
                  {available 
                    ? `剩余 ${slot.capacity} 个名额`
                    : '已约满'}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* 预约确认弹窗 */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">确认预约</h3>
            <p className="mb-4">
              {format(new Date(selectedSlot.start_time), 'yyyy-MM-dd HH:mm')}
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setSelectedSlot(null)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={confirmReservation}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                确认预约
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}