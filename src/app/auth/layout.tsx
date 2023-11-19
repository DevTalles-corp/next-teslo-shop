import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const revalidate = 0;


export default async function ShopLayout( { children }: {
  children: React.ReactNode;
} ) {

  const session = await auth();
  if ( session ) {
    redirect('/')
  }


  return (
    <main className="flex justify-center">
      <div className="w-full sm:w-[350px] px-10">

        { children }

      </div>
    </main>
  );
}