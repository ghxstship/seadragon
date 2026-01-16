'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SmsSetupClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Setup SMS Verification</h1>
          <p className="text-neutral-600">Receive security codes via text message</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                Phone Number
              </label>
              <div className="flex">
                <Select defaultValue="+1">
                  <SelectTrigger className="px-3 py-2 border border-r-0 border-neutral-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
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
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                We&apos;ll send verification codes to this number
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
            >
              Send Test Code
            </Button>
          </form>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">SMS vs Authenticator App</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-green-900 mb-1">SMS Benefits</h4>
              <ul className="text-green-800 space-y-1">
                <li>• Easy setup</li>
                <li>• No extra app needed</li>
                <li>• Works everywhere</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-orange-900 mb-1">Consider Authenticator</h4>
              <ul className="text-orange-800 space-y-1">
                <li>• More secure</li>
                <li>• Works offline</li>
                <li>• No SMS delays</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-600">
            Prefer an authenticator app?{' '}
            <a href="/auth/mfa/setup/authenticator" className="text-accent-secondary hover:text-blue-800">
              Set up authenticator
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
