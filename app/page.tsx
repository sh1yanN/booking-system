import { createClient } from '@/utils/supabase/client'

export default async function Home() {
  const supabase = createClient()
  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, name, slug, description')

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">商家列表</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {businesses?.map((biz) => (
          <a
            key={biz.id}
            href={`/biz/${biz.slug}`}
            className="p-6 border rounded-lg hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">{biz.name}</h2>
            <p className="text-gray-600 mt-2">{biz.description}</p>
          </a>
        ))}
      </div>
    </div>
  )
}