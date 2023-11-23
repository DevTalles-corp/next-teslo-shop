"use server";

import { auth } from "@/auth.config";
// import { Size } from '@/interfaces';
import prisma from "@/lib/prisma";
import { Size } from "@prisma/client";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (productIds: ProductToOrder[]) => {
  const session = await auth();
  console.log({ session, productIds });

  // Verificar que haya sesión de usuario
  const userId = session?.user.id;
  if (!userId) return { ok: false, message: "No hay sesión de usuario" };

  // Obtener productos de base de datos para calculos iniciales
  // de los montos del carrito de compras
  const products = await prisma.product.findMany({
    select: {
      id: true,
      price: true,
      inStock: true,
    },
    where: {
      id: {
        in: productIds.map((product) => product.productId),
      },
    },
  });

  // Calcular los montons
  const itemsInOrder = productIds.reduce(
    (count, product) => count + product.quantity,
    0
  );
  const { subTotal, tax, total } = products.reduce(
    (totals, product) => {
      const productQuantity = productIds.find(p => p.productId === product.id)?.quantity ?? 1;
      const subTotal = product.price * productQuantity;

      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;
      return totals;
      // return { subTotal: 0, tax: 0, total: 0 };
    },
    { subTotal: 0, tax: 0, total: 0 }
  );

  try {

    // Crear transacción
    // Porque el trabajo debe de ser secuencial y todo debe de tener éxito
    // https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#interactive-transactions
    const prismaTx = await prisma.$transaction(async (tx) => {
      // Actualizar el Stock de los productos
      const updatedProductsPromises = products.map(async (product) => {
        const productQuantity = productIds.find(
          (p) => p.productId === product.id
        )?.quantity;
        if (productQuantity === undefined) {
          throw new Error(`${product.id} no tiene cantidad definida`);
        }

        return tx.product.update({
          where: { id: product.id },
          data: { inStock: product.inStock - productQuantity },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      // Verificar que exista stock suficiente
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} no tiene stock suficiente`);
        }
      });

      // Crear orden
      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,

          OrderItem: {
            createMany: {
              data: productIds.map((product) => ({
                quantity: product.quantity,
                size: product.size,
                productId: product.productId,
                price:
                  products.find((p) => p.id === product.productId)?.price ?? 0,
              })),
            },
          },
        },
      });

      return { order, updatedProducts };
    });


    console.log({ prismaTx });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx,
    }

  } catch (error: any) {
    return { ok: false, message: error.message };
  }

};
