"use client"

import { useRouter } from "next/navigation"
import { MapIcon, ArrowRight } from "lucide-react"
import About from "../sections/About"
import { Button } from "@/components/ui/button"
import Footer from "../layout/Footer"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="relative flex flex-col items-center w-full min-h-screen bg-background selection:bg-primary/20 overflow-x-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-125 h-125 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <main className="w-full max-w-6xl mx-auto px-6 flex flex-col items-center">
        
        {/* Hero Section: Occupies significant viewport height */}
        <section className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 py-12">
          
          <div className="p-4 bg-primary/10 rounded-2xl animate-in fade-in zoom-in duration-500">
            <MapIcon className="w-10 h-10 text-primary" />
          </div>

          <div className="space-y-6 max-w-200">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground">
              Sakay <span className="text-primary">Davao</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl md:leading-relaxed max-w-137.5 mx-auto">
              A Davao Interim Bus Route Guide for commuters. 
              Navigate Davao City&apos;s transit network with confidence and ease.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              onClick={() => router.push("/maps")} 
              size="lg"
              className="h-14 px-16 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Start Commuting
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* About Section */}
        <div className="w-full">
          <About />
        </div>
      </main>

      <Footer />
    </div>
  )
}