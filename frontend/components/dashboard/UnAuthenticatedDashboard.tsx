import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const UnAuthenticatedDashboard = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="max-w-md w-full p-8 text-center">
      <Card
        avatarSrc="/favicon.svg"
        avatarName="Guest"
        heading="Bạn chưa đăng nhập"
        subheading="Vui lòng đăng nhập để tiếp tục sử dụng hệ thống."
        bodyText="Hãy đăng nhập để sử dụng đầy đủ chức năng."
        imageSrc=""
        imageAlt=""
        onCommentClick={() => {}}
        onShareClick={() => {}}
      />
      <Link href="/auth">
        <Button className="w-full mt-4">Đăng nhập</Button>
      </Link>
    </div>
  </div>
);

export default UnAuthenticatedDashboard;
