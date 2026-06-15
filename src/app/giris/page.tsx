'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/context/AuthContext'
import { AlertCircle, Lock, Mail, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Lütfen e-posta ve şifrenizi girin.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const { error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authErr) {
        setError(authErr.message === 'Invalid login credentials' 
          ? 'Hatalı e-posta veya şifre girdiniz.' 
          : authErr.message
        )
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (err: any) {
      setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-container"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column: Premium Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-container relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 30% 30%, #fea619 0%, transparent 60%), radial-gradient(circle at 70% 70%, #00B67A 0%, transparent 60%)'
        }} />
        <div className="relative z-10 max-w-md text-white space-y-6">
          <Link href="/" className="inline-block text-2xl font-black tracking-tight text-white mb-8">
            arabayasor.com
          </Link>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Aracınızın Gerçek Güvenilirlik Raporuna Ulaşın
          </h2>
          <p className="opacity-80 text-sm leading-relaxed">
            Binlerce otomobil sahibinin deneyimleri, ustaların teknik yorumları ve yapay zeka analizleri ile doğru kararları kolayca alın.
          </p>
          <div className="flex items-center gap-3 pt-6 text-secondary-fixed text-xs font-bold">
            <span>Teknik Güvenilirlik Topluluğu</span>
            <span className="h-1 w-1 rounded-full bg-secondary-fixed-dim"></span>
            <span>AI Destekli Raporlar</span>
          </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link href="/" className="lg:hidden inline-block text-xl font-black tracking-tight text-primary-container mb-6">
              arabayasor.com
            </Link>
            <h1 className="text-3xl font-black text-on-surface tracking-tight">Giriş Yap</h1>
            <p className="text-xs text-on-surface-variant mt-2">
              Topluluk analizlerine ve deneyim paylaşımlarına katılmak için hesabınıza giriş yapın.
            </p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3 border border-error/10">
              <AlertCircle className="h-5 w-5 text-error shrink-0" />
              <p className="text-xs font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="font-label-md text-xs font-bold text-on-surface block">E-Posta Adresi</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-border-low bg-surface-gray font-body-md text-sm outline-none focus:border-primary-container transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-xs font-bold text-on-surface block">Şifre</label>
                <a href="#" className="text-xs text-secondary hover:underline">Şifremi Unuttum</a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-border-low bg-surface-gray font-body-md text-sm outline-none focus:border-primary-container transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-container text-white h-12 rounded-xl font-bold text-sm hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="text-center text-xs text-on-surface-variant">
            Hesabınız yok mu?{' '}
            <Link href="/kayit" className="text-secondary font-bold hover:underline">
              Hemen Kayıt Olun
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
