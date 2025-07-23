// 절대 "use client" 쓰지 마시오! (서버 컴포넌트입니다)

export default function TestingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>; // 공통 레이아웃 제거
}
