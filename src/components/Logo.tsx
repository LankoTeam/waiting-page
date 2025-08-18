'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Box, Button, Dialog, Portal, HStack, Icon } from '@chakra-ui/react'
import { MdInfo } from 'react-icons/md'

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
        position="relative"
        cursor="pointer" 
        onClick={handleClick}
        transition="all 0.3s ease"
        _hover={{
          transform: "scale(1.05)"
        }}
      >
        {/* 氛围光晕 - 外圈 */}
        <Box
          position="absolute"
          top="-15px"
          left="-15px"
          right="-15px"
          bottom="-15px"
          borderRadius="8px"
          background="radial-gradient(ellipse at center, rgba(65, 47, 222, 0.3) 0%, rgba(65, 47, 222, 0.15) 50%, rgba(65, 47, 222, 0.05) 80%, transparent 100%)"
          filter="blur(8px)"
          zIndex={0}
        />
        
        {/* 氛围光晕 - 中圈 */}
        <Box
          position="absolute"
          top="-8px"
          left="-8px"
          right="-8px"
          bottom="-8px"
          borderRadius="6px"
          background="radial-gradient(ellipse at center, rgba(65, 47, 222, 0.4) 0%, rgba(65, 47, 222, 0.25) 60%, rgba(65, 47, 222, 0.1) 90%, transparent 100%)"
          filter="blur(5px)"
          zIndex={0}
        />
        
        {/* 氛围光晕 - 内圈 */}
        <Box
          position="absolute"
          top="-3px"
          left="-3px"
          right="-3px"
          bottom="-3px"
          borderRadius="4px"
          background="radial-gradient(ellipse at center, rgba(65, 47, 222, 0.5) 0%, rgba(65, 47, 222, 0.3) 70%, rgba(65, 47, 222, 0.15) 95%, transparent 100%)"
          filter="blur(3px)"
          zIndex={0}
        />
        
        {/* Logo 直接显示，无白色背景 */}
        <Box
          position="relative"
          zIndex={1}
        >
          <Image
            src="/lanko-main-logo-320x320.svg"
            alt="LANKO蓝扣 Logo"
            width={200}
            height={200}
            priority
          />
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box 
        position="relative"
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
          <>
            {/* 氛围光晕 - 外圈 */}
            <Box
              position="absolute"
              top="-15px"
              left="-15px"
              right="-15px"
              bottom="-15px"
              borderRadius="8px"
              background="radial-gradient(ellipse at center, rgba(65, 47, 222, 0.3) 0%, rgba(65, 47, 222, 0.15) 50%, rgba(65, 47, 222, 0.05) 80%, transparent 100%)"
              filter="blur(8px)"
              zIndex={0}
            />
            
            {/* 氛围光晕 - 中圈 */}
            <Box
              position="absolute"
              top="-8px"
              left="-8px"
              right="-8px"
              bottom="-8px"
              borderRadius="6px"
              background="radial-gradient(ellipse at center, rgba(65, 47, 222, 0.4) 0%, rgba(65, 47, 222, 0.25) 60%, rgba(65, 47, 222, 0.1) 90%, transparent 100%)"
              filter="blur(5px)"
              zIndex={0}
            />
            
            {/* 氛围光晕 - 内圈 */}
            <Box
              position="absolute"
              top="-3px"
              left="-3px"
              right="-3px"
              bottom="-3px"
              borderRadius="4px"
              background="radial-gradient(ellipse at center, rgba(65, 47, 222, 0.5) 0%, rgba(65, 47, 222, 0.3) 70%, rgba(65, 47, 222, 0.15) 95%, transparent 100%)"
              filter="blur(3px)"
              zIndex={0}
            />
            
            {/* Logo 直接显示，无白色背景 */}
            <Box
              position="relative"
              zIndex={1}
            >
              <Image
                src="/lanko-main-logo-320x320.svg"
                alt="LANKO蓝扣 Logo"
                width={200}
                height={200}
                priority
              />
            </Box>
          </>
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
                  <Icon size="lg" color="blue.400">
                    <MdInfo />
                  </Icon>
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
