'use client'

import { useTranslation } from 'react-i18next'
import { Select, createListCollection } from '@chakra-ui/react'
import '@/i18n/client' // 在客户端初始化i18next

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const changeLanguage = (lng: string | string[]) => {
    const language = Array.isArray(lng) ? lng[0] : lng
    i18n.changeLanguage(language)
  }

  const currentLanguage = i18n.language

  // 创建语言选项集合
  const languages = createListCollection({
    items: [
      { label: t('language.en'), value: 'en' },
      { label: t('language.zh'), value: 'zh' },
    ],
  })

  return (
    <Select.Root
      collection={languages}
      size="sm"
      width="120px"
      value={[currentLanguage]}
      onValueChange={(e) => changeLanguage(e.value)}
      variant="outline"
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={t('language.en')} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {languages.items.map((language) => (
            <Select.Item item={language} key={language.value}>
              {language.label}
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  )
}
