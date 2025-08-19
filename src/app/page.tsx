'use client'

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Logo from "@/components/Logo";
import WaitingListForm from "@/components/WaitingListForm";
import ThemeToggle from "@/components/ThemeToggle";
import CaptchaPreloader from "@/components/CaptchaPreloader";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Box, Stack, Container, Heading, Text } from '@chakra-ui/react';
import '@/i18n/client' // 在客户端初始化i18next

export default function Home() {
  const { t } = useTranslation()
  const [captchaReady, setCaptchaReady] = useState(false)

  // 验证码SDK准备就绪的回调函数
  const handleCaptchaReady = useCallback(() => {
    console.log('TCaptcha SDK已预加载完成')
    setCaptchaReady(true)
  }, [])

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      bg="var(--background)"
      style={{
        background: 'linear-gradient(to bottom, var(--gradient-start), var(--gradient-end))'
      }}
    >
      {/* 验证码SDK预加载组件 */}
      <CaptchaPreloader 
        onCaptchaReady={handleCaptchaReady}
      />
      
      <Box position="absolute" top={4} right={4}>
        <ThemeToggle />
      </Box>
      
      <Box as="main" flex="1" display="flex" flexDirection="column" justifyContent="center" py={8} px={4}>
        <Container maxW="4xl" centerContent>
          <Stack gap={10} align="center" width="100%">
            {/* Logo */}
            <Box mb={4}>
              <Logo />
            </Box>

            {/* 标题和描述 */}
            <Stack gap={4} textAlign="center" mb={8}>
              <Heading
                as="h1"
                fontSize="6xl"
                fontWeight="700"
                color="var(--brand-secondary)"
                mb={2}
                style={{
                  fontFamily: 'var(--font-reddit-sans)',
                  letterSpacing: '-0.02em'
                }}
              >
                LANKO
              </Heading>
              <Heading
                as="h2"
                fontSize="xl"
                fontWeight="500"
                color="var(--text-secondary)"
                mb={4}
              >
                {t('waitingList.subtitle')}
              </Heading>
              <Text
                fontSize="lg"
                color="var(--text-secondary)"
                maxW="700px"
                lineHeight="tall"
              >
                {t('waitingList.description')}
              </Text>
            </Stack>

            {/* 邮件订阅表单 */}
            <Box width="100%" maxW="36rem" px={4}>
              <WaitingListForm 
                captchaReady={captchaReady}
              />
            </Box>
          </Stack>
        </Container>
      </Box>

            {/* 页脚 */}
      <Box
        as="footer"
        py={6}
        px={4}
        borderTop="1px solid"
        borderColor="var(--footer-border)"
      >
        <Container maxW="4xl">
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            flexDirection={{ base: "column", sm: "row" }}
            gap={{ base: 3, sm: 0 }}
          >
            {/* 左侧版权信息 */}
            <Text
              color="var(--text-muted)"
              fontSize="sm"
              textAlign={{ base: "center", sm: "left" }}
            >
              {t('footer.copyright')}
            </Text>
            
            {/* 右侧语言切换 */}
            <LanguageSwitcher />
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
