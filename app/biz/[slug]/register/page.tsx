'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function BizRegistration() {
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    const { error } = await supabase.from('businesses').insert({
      name,
      description,
      owner_id: user.id,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      open_hours: {} // 初始化为空对象
    })

    error 
      ? alert(`提交失败：${error.message}`) 
      : router.push('/biz/dashboard')
  }

  return (
    <form action={handleSubmit} className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">商家入驻申请</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">商家名称</label>
          <input
            name="name"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2">商家描述</label>
          <textarea
            name="description"
            required
            className="w-full p-2 border rounded h-32"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          提交申请
        </button>
      </div>
    </form>
  )
}