'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Box, Button, Dialog, Portal, HStack } from '@chakra-ui/react'
import { InfoIcon } from '@chakra-ui/icons'

export default function Logo() {
  const [clickCount, setClickCount] = useState(0)
  const [isEasterEgg, setIsEasterEgg] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 防止 SSR 水合不匹配
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = useCallback(() => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    
    if (newCount === 10) {
      setIsEasterEgg(true)
      setIsOpen(true)
    }
  }, [clickCount])

  // 避免 SSR 水合不匹配，在客户端挂载前始终显示 Logo
  if (!mounted) {
    return (
      <Box 
        cursor="pointer" 
        onClick={handleClick}
        transition="all 0.3s ease"
        _hover={{
          transform: "scale(1.05)"
        }}
      >
        <Image
          src="/lanko-main-logo-320x320.svg"
          alt="LANKO蓝扣 Logo"
          width={200}
          height={200}
          priority
        />
      </Box>
    )
  }

  return (
    <>
      <Box 
        cursor="pointer" 
        onClick={handleClick}
        fontSize={isEasterEgg ? "200px" : "inherit"}
        transition="all 0.3s ease"
        _hover={{
          transform: "scale(1.05)"
        }}
      >
        {isEasterEgg ? (
          "👋"
        ) : (
          <Image
            src="/lanko-main-logo-320x320.svg"
            alt="LANKO蓝扣 Logo"
            width={200}
            height={200}
            priority
          />
        )}
      </Box>

      <Dialog.Root 
        open={isOpen} 
        onOpenChange={(e) => setIsOpen(e.open)}
        placement="center"
        motionPreset="slide-in-bottom"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <HStack>
                  <InfoIcon color="blue.400" boxSize={6} />
                  <Dialog.Title>发现彩蛋！</Dialog.Title>
                </HStack>
              </Dialog.Header>
              <Dialog.Body>
                嘻嘻，被你发现啦！敬请期待我们的新产品哦~
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button colorScheme="blue" onClick={() => setIsOpen(false)}>
                    好的！
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}
