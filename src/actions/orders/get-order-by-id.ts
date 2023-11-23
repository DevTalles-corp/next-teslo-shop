'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';


export const getOrderById = async(id: string) => {

  const session = await auth();

  if ( !session?.user ) return {
    ok: false,
    error: 'Debe de estar autenticado'
  }


  try {

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        OrderItem: {

          // Luego hacer esto manualmente
          select: {
            price: true,
            quantity: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: {
                  select: {
                    url: true
                  },
                  take: 1
                }
              }
            }
          }
        },
      }
    });

    if ( !order ) throw `${ id } not found`;

    // Verificar si la orden es del usuario autenticado
    if ( session.user.role === 'user' ) {
      if ( session.user.id !== order.userId ) {
        throw `${ id } not found`; // No tiene permiso para ver esta orden
      }
    }



    return {
      ok: true,
      order: order,
    }


  } catch (error) {
    console.log(error);
    return  {
      ok: false,
      error: `${ id } not found`
    }
  }
  

}