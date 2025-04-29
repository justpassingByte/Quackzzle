"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { LiberationBadge } from '../ui/LiberationBadge';


interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGameModal({ isOpen, onClose }: CreateGameModalProps) {
  const router = useRouter();
  const [gameTitle, setGameTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameTitle) return;

    setIsLoading(true);
    
    try {
      // Tạo một ID tạm thời cho người dùng
      const hostId = Math.random().toString(36).substring(2, 10);
      localStorage.setItem('userId', hostId);
      
      // Sử dụng API để tạo game mới
      const response = await fetch('/api/game/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hostId,
          hostName: 'Host'
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error('Failed to create game');
      }
      
      const data = await response.json();
      console.log('Created game API response:', data);
      
      if (data.success && data.data?.game) {
        // Chuyển hướng đến trang game sau khi tạo - dùng gameCode để routing
        router.push(`/game/${data.data.game.gameCode}?playerId=${hostId}&host=true`);
      } else {
        throw new Error(data.error || 'Failed to create game');
      }
      
      onClose();
    } catch (error) {
      console.error('Lỗi khi tạo game:', error);
      alert('Có lỗi xảy ra khi tạo game. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo Game Mới">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 vietnam-flag"></div>
          <LiberationBadge label="Đặc biệt 30/4" />
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Tạo phòng chơi mới và mời bạn bè tham gia để kiểm tra kiến thức về ngày Giải phóng!
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Tên Game"
            placeholder="Nhập tên phòng chơi"
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            required
            variant="outlined"
          />
      
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Tạo Game
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
} 