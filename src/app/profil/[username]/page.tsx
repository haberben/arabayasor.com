'use client'

import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Sparkles, AlertCircle, Wrench, ShieldAlert, ArrowRight, Star, ChevronRight, HelpCircle, ThumbsUp, ThumbsDown, UserCheck } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: {
    username: string
  }
}

export default function ProfilePage({ params }: PageProps) {
  const { username } = params

  // Mock data representing Usta Selim Y.
  const profile = {
    username: username === 'usta-selim-y' ? 'usta_selim_y' : username,
    fullName: username === 'usta-selim-y' ? 'Selim Yılmaz (Usta)' : `@${username}`,
    role: 'Master Usta',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzux_x7eQ2SOEtqUmwU6lMlvrggFSs5lU79OmrrgDmDBLp9x_sy0hKs86kfJp1rF9X_irH35hDzBYe9HAxm6MWJkUyMJKTZc-aNXRCysBuq9uoPTiGh1XJ8V-9h7LnphCbkEYNWi0k6RCgejWE3aZTgpMn55z0Qw3H3Q00iM-RTBrCb4ZL1v1ip2zrHoJT2jmUYi2mjU01B4XG8Xdi9KB_LkoGahl8jfFQvBkuwiYlpPqERfVOG4EU0WqkWoWoK6wObOINi70f0qM',
    bio: '20 yılı aşkın otomotiv mekanik tecrübesi ile topluluğumuza teknik analizler ve kronik sorun çözümleri ile katkı sağlamaktadır.',
    trustPoints: '14.250',
    helpfulReviews: 118,
    topContributorRank: '#12',
    progressPct: 85,
    pointsLeft: 750,
    nextRank: 'Efsane Usta',
    currentRank: 'Master Usta'
  }

  const badges = [
    {
      name: 'BMW Specialist',
      desc: '42 Doğrulanmış Onarım',
      icon: 'directions_car',
      color: 'text-secondary-container bg-secondary-container/10'
    },
    {
      name: '100+ Helpful Reviews',
      desc: 'Topluluk Tercihi',
      icon: 'recommend',
      color: 'text-trust-green bg-trust-green/10'
    },
    {
      name: 'Technical Contributor',
      desc: 'Yüksek Etkili Yazar',
      icon: 'engineering',
      color: 'text-primary-container bg-primary-container/10'
    },
    {
      name: 'Founding Member',
      desc: 'Ocak 2024\'ten Beri',
      icon: 'workspace_premium',
      color: 'text-warning-red bg-warning-red/10'
    }
  ]

  const contributions = [
    {
      title: 'BMW 3 Series (F30) - Timing Chain Chronic Issue Analysis',
      date: '2 gün önce eklendi',
      category: 'Teknik Rehber',
      impact: '+450',
      appreciations: '24'
    },
    {
      title: 'Doğrulanmış İnceleme: Audi A4 2.0 TDI Motor Ömrü',
      date: '1 hafta önce eklendi',
      category: 'Kullanıcı İncelemesi',
      impact: '+120',
      appreciations: '12'
    },
    {
      title: 'Hata Bildirimi: Mobil Safari Filtreleme Glitch\'i',
      date: '2 hafta önce çözüldü',
      category: 'Topluluk Desteği',
      impact: '+80',
      appreciations: 'Çözüldü'
    }
  ]

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        
        {/* Left SideNav Filters */}
        <aside className="hidden lg:flex flex-col p-4 gap-4 bg-surface-container-low h-fit sticky top-24 rounded-2xl border border-border-low">
          <div className="flex items-center gap-3 mb-2 border-b border-border/60 pb-3">
            <span className="material-symbols-outlined text-primary">filter_list</span>
            <div>
              <h3 className="font-title-md text-sm font-bold text-on-surface">Detaylı Filtreler</h3>
              <p className="font-label-md text-[10px] text-muted">Sonuçları daraltın</p>
            </div>
          </div>
          <nav className="space-y-1 text-xs">
            <a className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg font-bold" href="#">
              <span className="material-symbols-outlined text-sm">calendar_today</span> Model Yılı
            </a>
            <a className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg font-bold" href="#">
              <span className="material-symbols-outlined text-sm">ev_station</span> Yakıt Tipi
            </a>
            <a className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg font-bold" href="#">
              <span className="material-symbols-outlined text-sm">settings_input_component</span> Şanzıman
            </a>
            <a className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg font-bold" href="#">
              <span className="material-symbols-outlined text-sm">enable</span> Motor Hacmi
            </a>
            <a className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg font-bold" href="#">
              <span className="material-symbols-outlined text-sm">settings_input_antenna</span> Çekiş Tipi
            </a>
          </nav>
          <button className="mt-4 w-full bg-secondary-container text-on-secondary-container text-xs py-3 rounded-xl font-bold hover:scale-[0.98] transition-all">
            Filtreleri Uygula
          </button>
        </aside>

        {/* Right Main Content */}
        <div className="space-y-8">
          
          {/* 1. Profile Header Card */}
          <section className="bg-white p-8 rounded-3xl border border-border shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
              <div className="relative shrink-0">
                <div className="w-32 h-32 rounded-full border-4 border-secondary-container overflow-hidden bg-slate-100">
                  <img alt={profile.fullName} className="w-full h-full object-cover" src={profile.avatarUrl} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span>Usta</span>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                  <h1 className="text-2xl font-black text-on-surface">@{profile.username}</h1>
                  <span className="bg-primary-container text-white px-4 py-1 rounded-full text-xs font-bold w-fit mx-auto md:mx-0">
                    {profile.role}
                  </span>
                </div>
                <p className="text-muted text-xs leading-relaxed max-w-xl mb-6">
                  {profile.bio}
                </p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6 border-t border-border/60 pt-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Güven Puanı</span>
                    <span className="text-2xl font-black text-trust-green">{profile.trustPoints}</span>
                  </div>
                  <div className="w-px h-12 bg-border hidden md:block"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Yardımcı İncelemeler</span>
                    <span className="text-2xl font-black text-foreground">{profile.helpfulReviews}</span>
                  </div>
                  <div className="w-px h-12 bg-border hidden md:block"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Katkı Sıralaması</span>
                    <span className="text-2xl font-black text-foreground">{profile.topContributorRank}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Rank Progress Section */}
          <section className="bg-white p-8 rounded-3xl border border-border shadow-sm">
            <div className="flex justify-between items-end mb-4 text-xs font-bold">
              <div>
                <h2 className="text-sm font-black text-foreground">Üyelik Seviye İlerlemesi</h2>
                <p className="text-muted mt-0.5">Bir sonraki seviye: <span className="text-secondary font-bold">{profile.nextRank}</span></p>
              </div>
              <span className="text-muted">{profile.pointsLeft} Puan Kaldı</span>
            </div>
            
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-accent to-[#ffddb8] rounded-full transition-all duration-500" 
                style={{ width: `${profile.progressPct}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between mt-3 text-[10px] font-bold">
              <span className="text-muted-foreground">{profile.currentRank}</span>
              <span className="text-foreground">%{profile.progressPct} Tamamlandı</span>
              <span className="text-secondary">{profile.nextRank}</span>
            </div>
          </section>

          {/* 3. Badges Gallery */}
          <section className="space-y-4">
            <h2 className="text-lg font-black text-on-surface">Uzmanlık Rozetleri</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-border text-center flex flex-col items-center hover:border-secondary-container transition-all cursor-default shadow-sm">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${badge.color}`}>
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {badge.icon}
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-foreground mb-1">{badge.name}</h3>
                  <p className="text-[10px] text-muted">{badge.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Contribution History */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-on-surface">Katkı Geçmişi</h2>
              <button className="text-secondary font-bold text-xs flex items-center gap-1 hover:underline">
                Tümünü Gör <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {contributions.map((item, idx) => (
                <div key={idx} className="bg-white border border-border rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all shadow-sm">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-border/40 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">article</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-foreground mb-1 leading-snug">{item.title}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-muted">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-foreground font-bold">{item.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-border/40 text-xs font-bold">
                    <div className="flex flex-col items-center">
                      <span className="text-trust-green">{item.impact}</span>
                      <span className="text-[10px] text-muted font-normal">Etki</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-foreground">{item.appreciations}</span>
                      <span className="text-[10px] text-muted font-normal">
                        {item.appreciations === 'Çözüldü' ? 'Durum' : 'Beğeni'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  )
}
