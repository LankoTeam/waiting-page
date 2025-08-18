'use client'

import Image from "next/image";
import WaitingListForm from "@/components/WaitingListForm";
import ThemeToggle from "@/components/ThemeToggle";
import { Box, Stack, Container, Heading, Text } from '@chakra-ui/react';

export default function Home() {
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
      <ThemeToggle />
      
      <Box as="main" flex="1" display="flex" flexDirection="column" justifyContent="center" py={8} px={4}>
        <Container maxW="4xl" centerContent>
          <Stack gap={10} align="center" width="100%">
            {/* Logo */}
            <Box mb={4}>
              <Image
                src="/lanko-main-logo-320x320.svg"
                alt="LANKO蓝扣 Logo"
                width={200}
                height={200}
                priority
              />
            </Box>

            {/* 标题和描述 */}
            <Stack gap={4} textAlign="center" mb={8}>
              <Heading
                as="h1"
                fontSize="3xl"
                fontWeight="700"
                color="var(--brand-secondary)"
                mb={2}
              >
                LANKO蓝扣
              </Heading>
              <Heading
                as="h2"
                fontSize="xl"
                fontWeight="500"
                color="var(--text-secondary)"
                mb={4}
              >
                即将上线
              </Heading>
              <Text
                fontSize="lg"
                color="var(--text-secondary)"
                maxW="700px"
                lineHeight="tall"
              >
                专为国人设计的全新MeetUp活动平台，敬请期待。
              </Text>
            </Stack>

            {/* 邮件订阅表单 */}
            <Box width="100%" maxW="36rem" px={4}>
              <WaitingListForm />
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* 页脚 */}
      <Box
        as="footer"
        py={6}
        px={4}
        textAlign="center"
        borderTop="1px solid"
        borderColor="var(--footer-border)"
      >
        <Container maxW="4xl">
          <Text
            color="var(--text-muted)"
            fontSize="sm"
          >
            © {new Date().getFullYear()} LANKO All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
