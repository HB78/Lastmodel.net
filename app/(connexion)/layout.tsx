import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen items-center justify-between">
      <div className="hidden h-full bg-black lg:block lg:w-1/2">
        <Image
          src="/last.png"
          alt="nina"
          width={700}
          height={700}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex h-full w-full items-center justify-center bg-black px-2 md:px-0 lg:w-1/2">
        {children}
      </div>
    </div>
  );
}
