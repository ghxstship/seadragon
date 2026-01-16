
'use client'

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { useThemeContext } from "@/contexts/ThemeContext"
import { Sun, Moon, CloudMoon, Monitor, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function AppearanceSettingsClient() {
  const { mode, setTheme } = useThemeContext()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Appearance Settings</h1>
          <p className="text-text-secondary">Customize how Opus Zero looks and feels</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Theme Selection */}
          <div className="bg-bg-elevated rounded-lg shadow-md p-6 border border-border-default">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Theme</h2>
            <div className="space-y-4">
              {/* Light Theme */}
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  "w-full border rounded-lg p-4 text-left transition-all",
                  mode === 'light' 
                    ? "border-accent-primary bg-accent-primary/5" 
                    : "border-border-default hover:border-border-strong"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium text-text-primary">Light</span>
                  </div>
                  {mode === 'light' && <Check className="w-5 h-5 text-accent-primary" />}
                </div>
                <p className="text-sm text-text-muted ml-8">Clean and bright interface</p>
                <div className="ml-8 mt-2 p-3 bg-white border border-neutral-200 rounded">
                  <div className="text-xs text-neutral-600">Preview text in light theme</div>
                </div>
              </button>

              {/* Dark Theme */}
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  "w-full border rounded-lg p-4 text-left transition-all",
                  mode === 'dark' 
                    ? "border-accent-primary bg-accent-primary/5" 
                    : "border-border-default hover:border-border-strong"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-text-primary">Dark</span>
                  </div>
                  {mode === 'dark' && <Check className="w-5 h-5 text-accent-primary" />}
                </div>
                <p className="text-sm text-text-muted ml-8">Easy on the eyes in low light</p>
                <div className="ml-8 mt-2 p-3 bg-neutral-900 border border-neutral-700 rounded">
                  <div className="text-xs text-neutral-300">Preview text in dark theme</div>
                </div>
              </button>

              {/* Low Light Theme */}
              <button
                onClick={() => setTheme('lowLight')}
                className={cn(
                  "w-full border rounded-lg p-4 text-left transition-all",
                  mode === 'lowLight' 
                    ? "border-accent-primary bg-accent-primary/5" 
                    : "border-border-default hover:border-border-strong"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <CloudMoon className="w-5 h-5 text-indigo-400" />
                    <span className="font-medium text-text-primary">Low Light</span>
                  </div>
                  {mode === 'lowLight' && <Check className="w-5 h-5 text-accent-primary" />}
                </div>
                <p className="text-sm text-text-muted ml-8">Soft, atmospheric mode for late night</p>
                <div className="ml-8 mt-2 p-3 bg-neutral-800 border border-neutral-600 rounded">
                  <div className="text-xs text-neutral-400">Preview text in low-light theme</div>
                </div>
              </button>

              {/* Auto Theme */}
              <button
                onClick={() => setTheme('auto')}
                className={cn(
                  "w-full border rounded-lg p-4 text-left transition-all",
                  mode === 'auto' 
                    ? "border-accent-primary bg-accent-primary/5" 
                    : "border-border-default hover:border-border-strong"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-text-muted" />
                    <span className="font-medium text-text-primary">Auto</span>
                  </div>
                  {mode === 'auto' && <Check className="w-5 h-5 text-accent-primary" />}
                </div>
                <p className="text-sm text-text-muted ml-8">Follow your system preference</p>
                <div className="ml-8 mt-2 p-3 bg-gradient-to-r from-white to-neutral-900 border border-neutral-200 rounded">
                  <div className="text-xs text-neutral-600">Adapts to your device</div>
                </div>
              </button>
            </div>

            {/* Quick Theme Switcher */}
            <div className="mt-6 pt-4 border-t border-border-default">
              <p className="text-sm text-text-muted mb-3">Quick switch:</p>
              <ThemeSwitcher showLabels />
            </div>
          </div>

          {/* Display Preferences */}
          <div className="bg-bg-elevated rounded-lg shadow-md p-6 border border-border-default">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Display Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Font Size
                </label>
                <Select defaultValue="medium">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium (Default)</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="extra-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Content Density
                </label>
                <Select defaultValue="comfortable">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select content density" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable (Default)</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="animations" className="mr-3 rounded" defaultChecked />
                <label htmlFor="animations" className="text-sm text-text-primary">
                  Enable animations and transitions
                </label>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="sidebar" className="mr-3 rounded" defaultChecked />
                <label htmlFor="sidebar" className="text-sm text-text-primary">
                  Show sidebar on desktop
                </label>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="tooltips" className="mr-3 rounded" />
                <label htmlFor="tooltips" className="text-sm text-text-primary">
                  Show helpful tooltips
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Language & Region */}
          <div className="bg-bg-elevated rounded-lg shadow-md p-6 border border-border-default">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Language & Region</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Language
                </label>
                <Select defaultValue="en-us">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-us">English (US)</SelectItem>
                    <SelectItem value="en-uk">English (UK)</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="ko">Korean</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Date Format
                </label>
                <Select defaultValue="mm-dd-yyyy">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mm-dd-yyyy">MM/DD/YYYY (US)</SelectItem>
                    <SelectItem value="dd-mm-yyyy">DD/MM/YYYY (UK)</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD (ISO)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Time Format
                </label>
                <Select defaultValue="12-hour">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12-hour">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24-hour">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div className="bg-bg-elevated rounded-lg shadow-md p-6 border border-border-default">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Accessibility</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input type="checkbox" id="high-contrast" className="mr-3 rounded" />
                <label htmlFor="high-contrast" className="text-sm text-text-primary">
                  High contrast mode
                </label>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="reduce-motion" className="mr-3 rounded" />
                <label htmlFor="reduce-motion" className="text-sm text-text-primary">
                  Reduce motion and animations
                </label>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="large-text" className="mr-3 rounded" />
                <label htmlFor="large-text" className="text-sm text-text-primary">
                  Large text for better readability
                </label>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="screen-reader" className="mr-3 rounded" />
                <label htmlFor="screen-reader" className="text-sm text-text-primary">
                  Optimize for screen readers
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Color Blindness Support
                </label>
                <Select defaultValue="none">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select color blindness support" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="deuteranopia">Deuteranopia (Green-weak)</SelectItem>
                    <SelectItem value="protanopia">Protanopia (Red-weak)</SelectItem>
                    <SelectItem value="tritanopia">Tritanopia (Blue-weak)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-bg-secondary rounded-lg p-6 border border-border-default">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Preview Your Changes</h2>
          <div className="bg-bg-elevated rounded-lg p-6 border border-border-default">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-accent-primary font-semibold">JD</span>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">John Doe</h3>
                  <p className="text-sm text-text-muted">This is how your profile looks with current settings</p>
                </div>
              </div>

              <div className="border-t border-border-default pt-4">
                <p className="text-sm text-text-secondary">
                  Sample content to preview your theme and font settings. This text shows how your chosen preferences affect the appearance of content throughout the platform.
                </p>
                <Button className="mt-3">
                  Sample Button
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-4">
            <Button variant="outline">
              Reset to Defaults
            </Button>
            <Button>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
