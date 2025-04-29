"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { LiberationBanner } from '@/components/ui/LiberationBanner'
import { LiberationBadge } from '@/components/ui/LiberationBadge'
import { MarqueeText } from '@/components/ui/MarqueeText'
import { CreateGameModal } from '@/components/game/CreateGameModal'
import { JoinGameModal } from '@/components/game/JoinGameModal'
import Image from 'next/image'

export default function Home() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const openJoinModal = () => {
    setJoinModalOpen(true);
  };

  const closeJoinModal = () => {
    setJoinModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
      <LiberationBanner className="mb-8" />
      
      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <div className="vietnam-flag w-12 h-8 mx-auto mb-2 opacity-90"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold heading-gradient mb-2">Quackzzle</h1>
          <h2 className="text-xl md:text-2xl font-medium text-red-600/80 mb-4">Chào mừng ngày giải phóng 30/4</h2>
          <div className="flex justify-center space-x-2 mb-4">
            <div className="float-animation" style={{ animationDelay: "0s" }}>
              <LiberationBadge label="30/4" />
            </div>
            <div className="float-animation" style={{ animationDelay: "0.5s" }}>
              <LiberationBadge label="Giải phóng" />
            </div>
            <div className="float-animation" style={{ animationDelay: "1s" }}>
              <LiberationBadge label="Thống nhất" />
            </div>
          </div>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Game đố vui có thưởng - Kiểm tra kiến thức của bạn về lịch sử Việt Nam!
          </p>
        </div>
        
        <div className="w-full h-12 my-6 relative overflow-hidden rounded-lg shadow-md bg-white/70 dark:bg-gray-800/70 border border-red-200 dark:border-red-900/20">
          <div className="absolute inset-0 liberation-gradient opacity-10"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <MarqueeText 
              text="🌟 Kỷ niệm 50 năm ngày giải phóng miền Nam 🌟 Trả lời câu hỏi để nhận thêm điểm thưởng 🌟 Chúc mừng lễ kỷ niệm 50 năm 🌟"
              className="font-bold text-lg md:text-xl text-red-600/90 dark:text-red-400"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card variant="glass" className="transform transition-all hover:scale-105 relative border-red-200/50 dark:border-red-900/30 float-animation" style={{ animationDelay: "0.2s" }}>
            <div className="absolute -top-2 -right-2">
              <LiberationBadge label="Đặc biệt" className="animate-pulse" />
            </div>
            <CardHeader>
              <CardTitle className="heading-gradient">Tạo Game Mới</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Tạo phòng chơi mới  
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 relative overflow-hidden rounded-lg mb-4 bg-red-50 dark:bg-red-900/20">
                <div className="absolute inset-0 bg-red-500/10 rounded-lg"></div>
                <div className="flex items-center justify-center h-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full"
                onClick={openCreateModal}
              >
                Tạo Game
              </Button>
            </CardFooter>
          </Card>
          
          <Card variant="glass" className="transform transition-all hover:scale-105 relative border-red-200/50 dark:border-red-900/30 float-animation" style={{ animationDelay: "0.7s" }}>
            <div className="absolute -top-2 -right-2">
              <LiberationBadge label="Đặc biệt" className="animate-pulse" />
            </div>
            <CardHeader>
              <CardTitle className="heading-gradient">Tham Gia Game</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Tham gia phòng chơi với mã tham gia từ bạn bè
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 relative overflow-hidden rounded-lg mb-4 bg-red-50 dark:bg-red-900/20">
                <div className="absolute inset-0 bg-red-500/10 rounded-lg"></div>
                <div className="flex items-center justify-center h-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full"
                onClick={openJoinModal}
              >
                Tham Gia Game
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 p-4 rounded-lg bg-white/70 dark:bg-gray-800/50 border border-yellow-400/30 shadow-sm float-animation" style={{ animationDelay: "0.4s" }}>
          <h3 className="text-center text-red-600/90 font-semibold mb-2">Sự kiện đặc biệt</h3>
          <p className="text-center text-gray-700 dark:text-gray-300">
            Trả lời chính xác câu hỏi về ngày giải phóng miền Nam để nhận thêm điểm thưởng! 🎉
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; 2023 Quackzzle. Chào mừng ngày Giải phóng miền Nam, thống nhất đất nước (30/4/1975 - 30/4/2025)
          </p>
        </div>
      </div>

      {/* Modal để tạo game mới */}
      <CreateGameModal isOpen={createModalOpen} onClose={closeCreateModal} />
      
      {/* Modal để tham gia game */}
      <JoinGameModal isOpen={joinModalOpen} onClose={closeJoinModal} />
    </div>
  )
}