"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface JoinGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinGameModal({ isOpen, onClose }: JoinGameModalProps) {
  const router = useRouter();
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameCode || !playerName) return;

    // Kiểm tra người chơi không được đặt tên là Host
    if (playerName.trim().toLowerCase() === 'host') {
      setError('Bạn không thể sử dụng tên "Host". Vui lòng chọn tên khác.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting to join game with code:', gameCode);
      
      // Sử dụng API để tham gia game
      const response = await fetch('/api/game/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameCode,
          playerName
        }),
      });
      
      console.log('Join game response status:', response.status);
      
      // Xử lý lỗi nếu response không thành công
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Join game error response:', errorData);
        
        if (response.status === 404) {
          setError('Game không tồn tại. Vui lòng kiểm tra mã game.');
        } else {
          setError(errorData.error || 'Không thể tham gia game. Vui lòng thử lại.');
        }
        return;
      }
      
      const data = await response.json();
      console.log('Join game response data:', data);
      
      if (data.success && data.data?.player) {
        const playerId = data.data.player.id;
        
        // Lưu userId vào localStorage để dễ dàng xác định người dùng
        localStorage.setItem('userId', playerId);
        
        // Chuyển hướng đến trang game
        router.push(`/game/${gameCode}?name=${encodeURIComponent(playerName)}&playerId=${playerId}`);
        onClose();
      } else {
        setError('Không thể tham gia game. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi tham gia game:', error);
      setError('Có lỗi xảy ra khi tham gia game. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tham Gia Game">
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Nhập mã phòng và tên của bạn để tham gia vào game cùng bạn bè!
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Mã Phòng"
            placeholder="Nhập mã phòng (6 ký tự)"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value.toUpperCase())}
            required
            variant="outlined"
            maxLength={6}
          />

          <Input
            label="Tên Người Chơi"
            placeholder="Nhập tên của bạn"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
            variant="outlined"
          />

          {error && (
            <div className="text-red-500 text-sm py-2">
              {error}
            </div>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Tham Gia Game
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
} 