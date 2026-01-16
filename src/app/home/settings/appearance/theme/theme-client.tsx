'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ThemeSettingsClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Theme Settings</h1>
          <p className="text-neutral-600">Choose your preferred color scheme and visual style</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Color Scheme</h2>
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors">
                <div className="flex items-center mb-2">
                  <Input type="radio" name="theme" id="light" className="mr-3" defaultChecked />
                  <label htmlFor="light" className="font-medium text-neutral-900 cursor-pointer">Light Theme</label>
                </div>
                <p className="text-sm text-neutral-600 ml-6">Clean and bright interface perfect for daytime use</p>
                <div className="ml-6 mt-3 p-3 bg-background border border-neutral-200 rounded">
                  <div className="text-xs text-neutral-600">Sample text in light theme</div>
                  <div className="mt-2 flex space-x-2">
                    <div className="w-4 h-4 bg-accent-secondary rounded"></div>
                    <div className="w-4 h-4 bg-semantic-success rounded"></div>
                    <div className="w-4 h-4 bg-accent-primary rounded"></div>
                  </div>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4 cursor-pointer hover:border-neutral-300 transition-colors">
                <div className="flex items-center mb-2">
                  <Input type="radio" name="theme" id="dark" className="mr-3" />
                  <label htmlFor="dark" className="font-medium text-neutral-900 cursor-pointer">Dark Theme</label>
                </div>
                <p className="text-sm text-neutral-600 ml-6">Easy on the eyes with dark backgrounds</p>
                <div className="ml-6 mt-3 p-3 bg-neutral-900 border border-gray-700 rounded">
                  <div className="text-xs text-neutral-300">Sample text in dark theme</div>
                  <div className="mt-2 flex space-x-2">
                    <div className="w-4 h-4 bg-accent-primary rounded"></div>
                    <div className="w-4 h-4 bg-semantic-success rounded"></div>
                    <div className="w-4 h-4 bg-purple-400 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4 cursor-pointer hover:border-indigo-300 transition-colors">
                <div className="flex items-center mb-2">
                  <Input type="radio" name="theme" id="auto" className="mr-3" />
                  <label htmlFor="auto" className="font-medium text-neutral-900 cursor-pointer">Auto Theme</label>
                </div>
                <p className="text-sm text-neutral-600 ml-6">Automatically switch based on your system preference</p>
                <div className="ml-6 mt-3 p-3 bg-gradient-to-r from-white to-gray-900 border border-neutral-200 rounded">
                  <div className="text-xs text-neutral-600">Adapts to your device settings</div>
                  <div className="mt-2 flex space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded"></div>
                    <div className="w-4 h-4 bg-gradient-to-r from-green-600 to-green-400 rounded"></div>
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-600 to-purple-400 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Accent Color</h2>
            <div className="space-y-4">
              <p className="text-sm text-neutral-600">Choose your preferred accent color for buttons and highlights</p>

              <div className="grid grid-cols-4 gap-3">
                <div className="cursor-pointer">
                  <div className="w-full aspect-square bg-accent-secondary rounded-lg border-4 border-blue-300 flex items-center justify-center">
                    <span className="text-primary-foreground font-medium"></span>
                  </div>
                  <p className="text-xs text-center mt-2 text-neutral-600">Blue</p>
                </div>

                <div className="cursor-pointer">
                  <div className="w-full aspect-square bg-semantic-success rounded-lg border-4 border-transparent hover:border-neutral-300 flex items-center justify-center">
                  </div>
                  <p className="text-xs text-center mt-2 text-neutral-600">Green</p>
                </div>

                <div className="cursor-pointer">
                  <div className="w-full aspect-square bg-accent-primary rounded-lg border-4 border-transparent hover:border-neutral-300 flex items-center justify-center">
                  </div>
                  <p className="text-xs text-center mt-2 text-neutral-600">Purple</p>
                </div>

                <div className="cursor-pointer">
                  <div className="w-full aspect-square bg-semantic-warning rounded-lg border-4 border-transparent hover:border-neutral-300 flex items-center justify-center">
                  </div>
                  <p className="text-xs text-center mt-2 text-neutral-600">Orange</p>
                </div>

                <div className="cursor-pointer">
                  <div className="w-full aspect-square bg-semantic-error rounded-lg border-4 border-transparent hover:border-neutral-300 flex items-center justify-center">
                  </div>
                  <p className="text-xs text-center mt-2 text-neutral-600">Red</p>
                </div>

                <div className="cursor-pointer">
                  <div className="w-full aspect-square bg-indigo-600 rounded-lg border-4 border-transparent hover:border-neutral-300 flex items-center justify-center">
                  </div>
                  <p className="text-xs text-center mt-2 text-neutral-600">Indigo</p>
                </div>

                <div className="cursor-pointer">
                  <div className="w-full aspect-square bg-pink-600 rounded-lg border-4 border-transparent hover:border-neutral-300 flex items-center justify-center">
                  </div>
                  <p className="text-xs text-center mt-2 text-neutral-600">Pink</p>
                </div>

                <div className="cursor-pointer">
                  <div className="w-full aspect-square bg-teal-600 rounded-lg border-4 border-transparent hover:border-neutral-300 flex items-center justify-center">
                  </div>
                  <p className="text-xs text-center mt-2 text-neutral-600">Teal</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Advanced Theme Options</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Background Style</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <Input type="radio" name="background" className="mr-3" defaultChecked />
                  <span className="text-sm">Solid color background</span>
                </label>
                <label className="flex items-center">
                  <Input type="radio" name="background" className="mr-3" />
                  <span className="text-sm">Subtle pattern background</span>
                </label>
                <label className="flex items-center">
                  <Input type="radio" name="background" className="mr-3" />
                  <span className="text-sm">Gradient background</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Border Radius</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <Input type="radio" name="radius" className="mr-3" />
                  <span className="text-sm">Sharp corners</span>
                </label>
                <label className="flex items-center">
                  <Input type="radio" name="radius" className="mr-3" defaultChecked />
                  <span className="text-sm">Rounded corners</span>
                </label>
                <label className="flex items-center">
                  <Input type="radio" name="radius" className="mr-3" />
                  <span className="text-sm">Very rounded</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Font Family</h3>
              <Select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                <SelectItem value="system-default">System default</SelectItem>
                <SelectItem value="sans-serif">Sans Serif</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="monospace">Monospace</SelectItem>
              </Select>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Animation Speed</h3>
              <Select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="fast">Fast</SelectItem>
                <SelectItem value="slow">Slow</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Theme Preview</h2>
          <div className="border border-neutral-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-accent-secondary font-semibold">JD</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">John Doe</h3>
                  <p className="text-sm text-neutral-600">This is how your profile appears with current theme settings</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-neutral-700 mb-4">
                  Sample content to preview your theme choices. This text demonstrates how your selected theme affects the overall appearance and readability of content throughout the platform.
                </p>

                <div className="flex space-x-3">
                  <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded hover:bg-accent-tertiary">
                    Primary Button
                  </Button>
                  <Button className="bg-background text-neutral-700 border border-neutral-300 px-4 py-2 rounded hover:bg-gray-50">
                    Secondary Button
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Theme Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Light Theme Benefits</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Better readability in bright environments</li>
                <li>• Traditional and familiar appearance</li>
                <li>• Easier on the eyes during daytime</li>
                <li>• Good for productivity and focus</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Dark Theme Benefits</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Reduces eye strain in low light</li>
                <li>• Better battery life on OLED screens</li>
                <li>• Modern and sleek appearance</li>
                <li>• Great for evening and night use</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Button className="bg-background text-neutral-700 border border-neutral-300 px-4 py-2 rounded hover:bg-gray-50">
              Reset to Default
            </Button>
            <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded hover:bg-accent-tertiary">
              Save Theme
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
