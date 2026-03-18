"use client"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="fixed bottom-6 left-0 w-full flex justify-center z-10 pointer-events-none">
      <div className="flex flex-col gap-1 items-center bg-transparent p-2">
        <div className="flex justify-center items-center space-x-4 text-[9px] md:text-[10px] text-gray-400/80 pointer-events-auto">
          <Link href="/terms-of-agreement" className="hover:text-blue-600 transition-colors uppercase font-bold tracking-tighter">
            Terms of Agreement
          </Link>
          <span className="w-1 h-1 bg-gray-300 rounded-full opacity-30" />
          <Link href="/copyright-regulations" className="hover:text-blue-600 transition-colors uppercase font-bold tracking-tighter">
            Copyright Regulations
          </Link>
          <span className="w-1 h-1 bg-gray-300 rounded-full opacity-30" />
          <Link href="/cookie-settings" className="hover:text-blue-600 transition-colors uppercase font-bold tracking-tighter">
            Cookie Settings
          </Link>
        </div>
        <div className="text-[8px] md:text-[9px] text-gray-300/60 uppercase tracking-[0.2em] font-black italic">
          &copy; {currentYear} Weerapp. All rights reserved.
        </div>
      </div>
    </footer>
  )
}