'use client'

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export function HotelsClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Hotels</h1>
          <p className="text-neutral-600">Find and manage your favorite stays</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Input placeholder="Search hotels or destinations" />
          <Select defaultValue="any">
            <SelectTrigger>
              <SelectValue placeholder="Price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any price</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="mid">Mid-range</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="any">
            <SelectTrigger>
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any rating</SelectItem>
              <SelectItem value="4">4+ stars</SelectItem>
              <SelectItem value="35">3.5+ stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-blue-300 to-indigo-400" />
              <div className="p-4 space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900">Hotel {idx}</h3>
                  <span className="text-sm text-neutral-500">4.{idx} </span>
                </div>
                <p className="text-sm text-neutral-600">Great location with modern amenities and breakfast included.</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-accent-secondary">$199/night</span>
                  <Button size="sm">View</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
