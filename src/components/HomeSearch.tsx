'use client'

import React, { useState, useEffect } from 'react'

const PLACEHOLDERS = [
  'BMW 320i kronik sorunlar',
  'Mercedes C200 yakıt tüketimi',
  'Audi A4 bakımı kaç TL?',
  'Renault Megane EDC sorun çıkarır mı?',
  'Toyota Corolla motor ömrü',
]

export default function HomeSearch() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length)
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mx-auto max-w-2xl">
      <form
        action="/arama"
        method="GET"
        className="flex items-center gap-3 rounded-2xl p-2 transition-all duration-300"
        style={{
          background: focused ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)',
          border: focused
            ? '1.5px solid rgba(254,166,25,0.6)'
            : '1.5px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(16px)',
          boxShadow: focused
            ? '0 0 0 4px rgba(254,166,25,0.12), 0 8px 32px rgba(0,0,0,0.2)'
            : '0 8px 32px rgba(0,0,0,0.15)',
        }}
      >
        <div className="flex items-center flex-1 gap-3 px-2">
          <span
            className="material-symbols-outlined text-[20px] shrink-0 transition-colors"
            style={{ color: focused ? 'var(--accent)' : 'rgba(200,215,235,0.6)' }}
          >
            search
          </span>
          <input
            id="hero-search-input"
            name="q"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-transparent py-3 text-sm md:text-base outline-none placeholder:transition-all"
            placeholder={PLACEHOLDERS[placeholderIndex]}
            type="text"
            style={{
              color: '#ffffff',
              caretColor: 'var(--accent)',
            }}
          />
        </div>
        <button
          id="hero-search-btn"
          type="submit"
          className="shrink-0 rounded-xl px-6 py-3 text-sm font-bold transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'var(--accent)',
            color: 'var(--accent-foreground)',
            boxShadow: '0 4px 16px rgba(254,166,25,0.35)',
          }}
        >
          Ara
        </button>
      </form>

      {/* Quick Suggestion Pills */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {['BMW E90', 'Volkswagen Passat', 'Toyota Corolla', 'Ford Focus'].map((item) => (
          <a
            key={item}
            href={`/arama?q=${encodeURIComponent(item)}`}
            className="rounded-full px-3 py-1 text-xs font-semibold transition-all hover:scale-105 hover:border-[var(--accent)]"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(200,215,235,0.8)',
            }}
          >
            {item}
          </a>
        ))}
      </div>
    </div>
  )
}
