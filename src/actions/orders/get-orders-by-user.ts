'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { Order } from '@prisma/client';

// Ustedes pueden hacer la paginación
export const getOrdersByUser = async() => {

  const session = await auth();
  if ( !session?.user ) {
    return {
      ok: false,
      message: 'Debe de estar autenticado',
    }
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      address: true
    }
  });

  return {
    ok: true,
    orders: orders,
  };

}