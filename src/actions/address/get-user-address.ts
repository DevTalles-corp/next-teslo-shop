"use server";

import prisma from "@/lib/prisma";

export const getUserAddress = async (userId: string) => {
  try {
    const address = await prisma.address.findUnique({
      where: {
        userId: userId,
      },
    });

    return address;


  } catch (error) {
    return null;
  }
};
