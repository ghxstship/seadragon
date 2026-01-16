
'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Header } from "@/lib/design-system"

export default function ContactPage() {
  const [test, setTest] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <Header/>

      <div className="container mx-auto py-20 px-4">
        <h1 className="text-4xl font-bold mb-8">Contact Page Test</h1>
        <p className="text-lg mb-8">
          This is a simplified contact page to test if the 500 error is resolved.
        </p>

        <div className="max-w-md">
          <input
            type="text"
            value={test}
            onChange={(e) => setTest(e.target.value)}
            placeholder="Test input"
            className="w-full p-3 border rounded mb-4"
          />
          <Button onClick={() => alert('Test button works!')}>
            Test Button
          </Button>
        </div>
      </div>
    </div>
  )
}
