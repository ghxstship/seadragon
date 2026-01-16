'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export function SmsSetupClient() {
  return (
    <div className="container mx-auto px-4 py-12 text-[--text-primary]">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-[--color-accent-primary]/15 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl text-[--color-accent-primary]">SMS</span>
          </div>
          <h1 className="text-3xl heading-anton">Setup SMS Verification</h1>
          <p className="text-[--text-secondary] body-share-tech">Receive security codes via text message</p>
        </div>

        <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
          <CardHeader>
            <CardTitle className="heading-anton">Your phone</CardTitle>
            <CardDescription className="text-[--text-secondary] body-share-tech">Add a number to receive one-time passcodes</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm text-[--text-secondary] body-share-tech mb-2">
                  Phone Number
                </label>
                <div className="flex rounded-full overflow-hidden border border-[--border-default] bg-[--surface-default] focus-within:ring-2 focus-within:ring-[--focus-ring]">
                  <Select defaultValue="+1">
                    <SelectTrigger className="w-24 h-11 border-0 bg-transparent pl-4 pr-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+1">+1</SelectItem>
                      <SelectItem value="+44">+44</SelectItem>
                      <SelectItem value="+49">+49</SelectItem>
                      <SelectItem value="+33">+33</SelectItem>
                      <SelectItem value="+81">+81</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    id="phone"
                    className="flex-1 h-11 border-0 bg-transparent focus-visible:ring-0"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
                <p className="text-xs text-[--text-secondary] body-share-tech mt-2">
                  We&apos;ll send verification codes to this number
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 transition"
              >
                Send Test Code
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-[--border-default] bg-[--surface-hover]">
          <CardHeader>
            <CardTitle className="text-base heading-anton">SMS vs Authenticator App</CardTitle>
            <CardDescription className="text-[--text-secondary] body-share-tech">Choose what fits best for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <h4 className="font-medium text-[--text-primary]">SMS Benefits</h4>
                <ul className="text-[--text-secondary] body-share-tech space-y-1">
                  <li>• Easy setup</li>
                  <li>• No extra app needed</li>
                  <li>• Works everywhere</li>
                </ul>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-[--text-primary]">Consider Authenticator</h4>
                <ul className="text-[--text-secondary] body-share-tech space-y-1">
                  <li>• More secure</li>
                  <li>• Works offline</li>
                  <li>• No SMS delays</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-[--text-secondary] body-share-tech">
            Prefer an authenticator app?{' '}
            <Link href="/auth/mfa/setup/authenticator" className="text-[--color-accent-primary] hover:underline">
              Set up authenticator
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
