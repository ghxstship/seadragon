
import { Metadata } from 'next'
import { AppearanceSettingsClient } from './client'

export const metadata: Metadata = {
  title: 'Appearance Settings | Opus Zero',
  description: 'Customize your display preferences, theme, language, and app appearance.',
}

export default function HomeSettingsAppearancePage() {
  return <AppearanceSettingsClient />
}
