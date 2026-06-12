'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface PageProps {
  params: {
    username: string
  }
}

export default function ProfilePage({ params }: PageProps) {
  const { username } = params

  const profile = {
    username: username === 'usta-selim-y' ? 'usta_selim_y' : username,
    fullName: 'Usta Selim Y.',
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
      desc: '42 Verified Fixes',
      icon: 'directions_car',
      iconColor: 'text-secondary-container',
      bgColor: 'bg-secondary-container/10'
    },
    {
      name: '100+ Helpful Reviews',
      desc: 'Community Choice',
      icon: 'recommend',
      iconColor: 'text-trust-green',
      bgColor: 'bg-trust-green/10'
    },
    {
      name: 'Technical Contributor',
      desc: 'High Impact Author',
      icon: 'engineering',
      iconColor: 'text-primary-container',
      bgColor: 'bg-primary-container/10'
    },
    {
      name: 'Founding Member',
      desc: 'Since Jan 2024',
      icon: 'workspace_premium',
      iconColor: 'text-warning-red',
      bgColor: 'bg-warning-red/10'
    }
  ]

  const contributions = [
    {
      title: 'BMW 3 Series (F30) - Timing Chain Chronic Issue Analysis',
      date: 'Added 2 days ago',
      category: 'Technical Guide',
      icon: 'article',
      impact: '+450',
      appreciations: '24'
    },
    {
      title: 'Verified Review: Audi A4 2.0 TDI Engine Longevity',
      date: 'Added 1 week ago',
      category: 'User Review',
      icon: 'rate_review',
      impact: '+120',
      appreciations: '12'
    },
    {
      title: 'Bug Report: Filter glitch in Mobile Safari',
      date: 'Resolved 2 weeks ago',
      category: 'Community Support',
      icon: 'report_problem',
      impact: '+80',
      appreciations: 'Resolved'
    }
  ]

  return (
    <>
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">

        {/* Left Sidebar Filters */}
        <aside className="hidden lg:flex flex-col p-4 gap-4 bg-surface-container-low h-fit sticky top-24 rounded-xl border border-border-low space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary">filter_list</span>
            <div>
              <h3 className="font-title-md text-[20px] font-semibold text-on-surface">Detailed Filters</h3>
              <p className="font-label-md text-[14px] text-on-surface-variant opacity-70">Refine vehicle results</p>
            </div>
          </div>
          <nav className="space-y-1">
            <a className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg font-label-md text-[14px]" href="#">
              <span className="material-symbols-outlined">calendar_today</span> Model Year
            </a>
            <a className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg font-label-md text-[14px]" href="#">
              <span className="material-symbols-outlined">ev_station</span> Fuel Type
            </a>
            <a className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg font-label-md text-[14px]" href="#">
              <span className="material-symbols-outlined">settings_input_component</span> Transmission
            </a>
            <a className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg font-label-md text-[14px]" href="#">
              <span className="material-symbols-outlined">enable</span> Engine Size
            </a>
            <a className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg font-label-md text-[14px]" href="#">
              <span className="material-symbols-outlined">settings_input_antenna</span> Drive Type
            </a>
          </nav>
          <button className="mt-4 w-full bg-secondary-container text-on-secondary-container font-label-md text-[14px] py-3 rounded-lg font-bold hover:scale-[0.98] transition-all">
            Apply Filters
          </button>
        </aside>

        {/* Main Content */}
        <div className="space-y-8">

          {/* 1. Profile Header */}
          <section className="bg-surface-container-lowest p-8 rounded-xl border border-border-low shadow-sm overflow-hidden relative">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
              <div className="relative shrink-0">
                <div className="w-32 h-32 rounded-full border-4 border-secondary-container overflow-hidden">
                  <img
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                    src={profile.avatarUrl}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-[12px] flex items-center gap-1 shadow-md">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  Master
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                  <h1 className="font-headline-lg text-[32px] font-bold text-on-surface" style={{ letterSpacing: '-0.01em' }}>{profile.fullName}</h1>
                  <span className="bg-primary-container text-on-primary px-4 py-1 rounded-full font-label-md text-[14px] w-fit mx-auto md:mx-0">{profile.role}</span>
                </div>
                <p className="font-body-md text-[16px] text-on-surface-variant max-w-xl mb-6">{profile.bio}</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  <div className="flex flex-col">
                    <span className="font-label-md text-[14px] text-on-surface-variant uppercase tracking-wider">Trust Points</span>
                    <span className="font-headline-lg text-[32px] font-bold text-trust-green" style={{ letterSpacing: '-0.01em' }}>{profile.trustPoints}</span>
                  </div>
                  <div className="w-px h-12 bg-border-low hidden md:block"></div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-[14px] text-on-surface-variant uppercase tracking-wider">Helpful Reviews</span>
                    <span className="font-headline-lg text-[32px] font-bold text-on-surface" style={{ letterSpacing: '-0.01em' }}>{profile.helpfulReviews}</span>
                  </div>
                  <div className="w-px h-12 bg-border-low hidden md:block"></div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-[14px] text-on-surface-variant uppercase tracking-wider">Top Contributor</span>
                    <span className="font-headline-lg text-[32px] font-bold text-on-surface" style={{ letterSpacing: '-0.01em' }}>{profile.topContributorRank}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Rank Progress */}
          <section className="bg-surface-container-lowest p-8 rounded-xl border border-border-low shadow-sm">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="font-title-md text-[20px] font-semibold text-on-surface">Rank Progress</h2>
                <p className="font-body-md text-[16px] text-on-surface-variant">Leveling up to <span className="text-secondary font-bold">{profile.nextRank}</span></p>
              </div>
              <span className="font-label-md text-[14px] text-on-surface-variant">{profile.pointsLeft} Points left</span>
            </div>
            <div className="w-full h-4 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${profile.progressPct}%`,
                  background: 'linear-gradient(90deg, #fea619 0%, #ffddb8 100%)'
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-3">
              <span className="font-label-md text-[14px] text-on-primary-container">{profile.currentRank}</span>
              <span className="font-label-md text-[14px] text-on-surface">{profile.progressPct}% Complete</span>
              <span className="font-label-md text-[14px] text-secondary">{profile.nextRank}</span>
            </div>
          </section>

          {/* 3. Badges Gallery */}
          <section>
            <h2 className="font-headline-lg text-[32px] font-bold text-on-surface mb-6" style={{ letterSpacing: '-0.01em' }}>Expertise Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge, idx) => (
                <div key={idx} className="bg-surface-container-lowest p-6 rounded-xl border border-border-low text-center flex flex-col items-center hover:border-secondary-container transition-all cursor-default">
                  <div className={`w-16 h-16 ${badge.bgColor} rounded-full flex items-center justify-center mb-4 ${badge.iconColor}`}>
                    <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {badge.icon}
                    </span>
                  </div>
                  <h3 className="font-label-md text-[14px] text-on-surface mb-1">{badge.name}</h3>
                  <p className="font-caption text-[12px] text-on-surface-variant">{badge.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Contribution History */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-lg text-[32px] font-bold text-on-surface" style={{ letterSpacing: '-0.01em' }}>Contribution History</h2>
              <button className="text-secondary font-label-md text-[14px] flex items-center gap-1 hover:underline">
                View All <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>

            <div className="space-y-4">
              {contributions.map((item, idx) => (
                <div key={idx} className="bg-surface-container-lowest border border-border-low rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-title-md text-[20px] font-semibold text-on-surface mb-1">{item.title}</h4>
                      <div className="flex items-center gap-3 font-caption text-[12px] text-on-surface-variant">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span className="bg-surface-container-high px-2 py-0.5 rounded text-on-surface">{item.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-border-low">
                    <div className="flex flex-col items-center">
                      <span className="font-label-md text-[14px] text-trust-green">{item.impact}</span>
                      <span className="font-caption text-[12px] text-on-surface-variant">Impact</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-label-md text-[14px] text-on-surface">{item.appreciations}</span>
                      <span className="font-caption text-[12px] text-on-surface-variant">
                        {item.appreciations === 'Resolved' ? 'Status' : 'Appreciations'}
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
