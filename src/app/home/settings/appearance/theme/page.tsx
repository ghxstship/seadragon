import { Metadata } from 'next'
import { ThemeSettingsClient } from './theme-client'

export const metadata: Metadata = {
  title: 'Theme Settings | ATLVS + GVTEWAY',
  description: 'Customize your theme preferences and visual appearance.',
}

export default function HomeSettingsAppearanceThemePage() {
  return <ThemeSettingsClient />
}
