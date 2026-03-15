"use client"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="fixed bottom-4 w-full text-center z-10 pointer-events-none">
      <div className="flex flex-col gap-1 items-center">
        <div className="flex justify-center space-x-4 text-[10px] text-gray-400 pointer-events-auto">
          <Link href="/terms-of-agreement" className="hover:text-blue-600 transition-colors uppercase font-bold tracking-tighter">
            Terms of Agreement
          </Link>
          <Link href="/copyright-regulations" className="hover:text-blue-600 transition-colors uppercase font-bold tracking-tighter">
            Copyright Regulations
          </Link>
          <Link href="/cookie-settings" className="hover:text-blue-600 transition-colors uppercase font-bold tracking-tighter">
            Cookie Settings
          </Link>
        </div>
        <div className="text-[9px] text-gray-300 uppercase tracking-widest font-medium">
          &copy; {currentYear} Weerapp. All rights reserved.
        </div>
      </div>
    </footer>
  )
}