'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/context/AuthContext'
import { AlertCircle, User, Mail, Lock, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  const supabase = createClient()

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fullName || !username || !email || !password || !confirmPassword) {
      setError('Lütfen tüm alanları doldurun.')
      return
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.')
      return
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakterden oluşmalıdır.')
      return
    }

    // Basic username format check
    const usernameRegex = /^[a-zA-Z0-9_\-]+$/
    if (!usernameRegex.test(username)) {
      setError('Kullanıcı adı sadece harf, rakam, alt tire (_) ve tire (-) içerebilir.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const { error: signUpErr, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            username: username.trim().toLowerCase()
          }
        }
      })

      if (signUpErr) {
        setError(signUpErr.message)
      } else {
        // If email confirmation is required, inform user, else login
        if (data.session) {
          router.push('/')
          router.refresh()
        } else {
          setSuccess('Kayıt başarılı! Lütfen e-posta adresinize gelen onay linkini kontrol edin.')
          // Reset fields
          setFullName('')
          setUsername('')
          setEmail('')
          setPassword('')
          setConfirmPassword('')
        }
      }
    } catch (err: any) {
      setError('Kayıt oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
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
            Topluluğa Katılın, Deneyimlerinizi Paylaşın
          </h2>
          <p className="opacity-80 text-sm leading-relaxed">
            Üye olarak diğer otomobil severlerle teknik dayanışmaya katılabilir, aracınızın kronik sorunlarını oylayabilir ve usta tavsiyelerini takip edebilirsiniz.
          </p>
          <div className="flex items-center gap-3 pt-6 text-secondary-fixed text-xs font-bold">
            <span>Teknik Paylaşımlar</span>
            <span className="h-1 w-1 rounded-full bg-secondary-fixed-dim"></span>
            <span>Usta Rozetleri</span>
          </div>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link href="/" className="lg:hidden inline-block text-xl font-black tracking-tight text-primary-container mb-6">
              arabayasor.com
            </Link>
            <h1 className="text-3xl font-black text-on-surface tracking-tight">Kayıt Ol</h1>
            <p className="text-xs text-on-surface-variant mt-2">
              Kendi kullanıcı profilinizi oluşturarak hemen arıza bildirimlerine başlayın.
            </p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3 border border-error/10">
              <AlertCircle className="h-5 w-5 text-error shrink-0" />
              <p className="text-xs font-bold">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-trust-green p-4 rounded-xl flex items-center gap-3 border border-trust-green/10">
              <AlertCircle className="h-5 w-5 text-trust-green shrink-0" />
              <p className="text-xs font-bold">{success}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="font-label-md text-xs font-bold text-on-surface block">Adınız Soyadınız</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                  <User className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Ahmet Yılmaz"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-low bg-surface-gray font-body-md text-sm outline-none focus:border-primary-container transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-label-md text-xs font-bold text-on-surface block">Kullanıcı Adı</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                  <User className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="ahmetyilmaz"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-low bg-surface-gray font-body-md text-sm outline-none focus:border-primary-container transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
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
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-low bg-surface-gray font-body-md text-sm outline-none focus:border-primary-container transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-label-md text-xs font-bold text-on-surface block">Şifre</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="En az 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-low bg-surface-gray font-body-md text-sm outline-none focus:border-primary-container transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-label-md text-xs font-bold text-on-surface block">Şifre Tekrar</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="Şifrenizi tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-low bg-surface-gray font-body-md text-sm outline-none focus:border-primary-container transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-container text-white h-11 rounded-xl font-bold text-sm hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 pt-1"
            >
              {submitting ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="text-center text-xs text-on-surface-variant">
            Zaten üye misiniz?{' '}
            <Link href="/giris" className="text-secondary font-bold hover:underline">
              Giriş Yapın
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
