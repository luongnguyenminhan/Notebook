import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const UserDashboard = ({ user }: { user: any }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="max-w-md w-full p-8 text-center">
      <Card
        avatarSrc="/favicon.svg"
        avatarName={user?.username || 'User'}
        heading="Xin chào User!"
        subheading={`Username: ${user?.username} | Email: ${user?.email}`}
        bodyText="Chào mừng bạn đến với hệ thống."
        imageSrc=""
        imageAlt=""
        onCommentClick={() => {}}
        onShareClick={() => {}}
      />
      <Button className="w-full mt-4">Xem hồ sơ</Button>
    </div>
  </div>
);

export default UserDashboard;
