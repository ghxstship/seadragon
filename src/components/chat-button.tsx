
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Chat } from '@/components/chat'

export function ChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 z-40 rounded-full w-12 h-12 shadow-lg"
        onClick={() => setIsChatOpen(true)}
        size="sm"
        type="button"
      >
        
      </Button>
      <Chat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)}/>
    </>
  )
}
