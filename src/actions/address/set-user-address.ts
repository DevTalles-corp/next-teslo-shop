'use server';

import type{ Address } from '@/interfaces';
import prisma from '@/lib/prisma';




export const setUserAddress = async( address: Address, userId: string ) => {

  try {
    const storedAddress = await createOrUpdateAddress(address, userId);

    return {
      ok: true,
      address: storedAddress
    }


  } catch (error) {
    
    return {
      ok: false,
      error: 'No se pudo grabar la dirección'
    }
  }

}



const createOrUpdateAddress = async( address: Address, userId: string ) => {

  try {
    
    const storedAddress = await prisma.address.findFirst({
      where: {
        userId: userId
      }
    });

    // No existe, se crea
    if ( !storedAddress ) {
      const newAddress = await prisma.address.create({
        data: {
          ...address,
          userId: userId,
        }
      });
      return newAddress;
    }

    // Existe, se actualiza
    const updatedAddress = await prisma.address.update({
      where: {
        id: storedAddress.id
      },
      data: {
        ...address
      }
    });

    return updatedAddress;


  } catch (error) {
    console.log(error);
    throw new Error('No se pudo grabar la dirección');
  }

}

