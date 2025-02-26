'use client'

import { createClient } from '@/utils/supabase/client'

export default function AuthButton() {
  const supabase = createClient()

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <button
      onClick={handleSignIn}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      使用Google登录
    </button>
  )
}