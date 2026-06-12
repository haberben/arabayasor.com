'use client'

import React, { useState, useEffect } from 'react'

export default function HomeSearch() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const placeholders = [
    "BMW 320i kronik sorunlar",
    "Mercedes C200 yakıt tüketimi",
    "Audi A4 bakımı kaç TL?",
    "Renault Megane EDC sorun çıkarır mı?"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-3xl mx-auto relative">
      <form 
        action="/arama" 
        method="GET" 
        className="flex bg-white rounded-full p-2 shadow-xl focus-within:ring-4 ring-secondary-container/30 transition-all"
      >
        <span className="material-symbols-outlined text-outline ml-4 self-center">search</span>
        <input 
          name="q"
          className="w-full border-none focus:ring-0 text-on-surface font-body-md text-body-md py-4 px-4 bg-transparent outline-none placeholder:text-outline" 
          placeholder={placeholders[placeholderIndex]} 
          type="text"
        />
        <button 
          type="submit" 
          className="bg-secondary-container text-on-secondary-container px-8 rounded-full font-label-md text-label-md hover:scale-105 active:scale-95 transition-all"
        >
          Ara
        </button>
      </form>
    </div>
  )
}
