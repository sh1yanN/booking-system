import { createClient } from '@/utils/supabase/client'
import Calendar from '@/components/Calendar'

export default async function BizPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createClient()
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', params.slug)
    .single()

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">{business?.name}</h1>
      <Calendar businessId={business?.id} />
    </div>
  )
}