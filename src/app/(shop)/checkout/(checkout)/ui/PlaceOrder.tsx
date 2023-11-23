"use client";

import { placeOrder } from '@/actions';
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat, sleep } from "@/utils";
import clsx from "clsx";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export const PlaceOrder = () => {

  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')

  const {
    address,
    address2,
    city,
    country,
    firstName,
    lastName,
    phone,
    postalCode,
  } = useAddressStore((state) => state.address);

  const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );
  const cart = useCartStore( state => state.cart );
  const clearCart = useCartStore( state => state.clearCart );

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setPlacingOrder(true);
    setErrorMessage('');
    // await sleep(2);
    const productsToOrder = cart.map( product => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    const result = await placeOrder( productsToOrder )
    console.log({result});
    if ( !result.ok ) {
      setErrorMessage( result.message );
      setPlacingOrder(false);
      return;
    } 

    // Limpiar carrito y redireccionar
    clearCart();
    router.replace('/orders/' + result.order?.id );


  };

  if (!loaded) {
    return <p>Espere por favor</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-xl">
          {firstName} {lastName}
        </p>
        <p>{address}</p>
        <p>{address2}</p>
        <p>{postalCode}</p>
        <p>
          {city}, {country}
        </p>
        <p>{phone}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Resumen de orden</h2>

      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
          {itemsInCart === 1
            ? `${itemsInCart} artículo`
            : `${itemsInCart} artículos`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">
          {currencyFormat(total)}
        </span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          {/* Disclaimer */}
          <span className="text-xs">
            Al hacer clic en &quot;Colocar orden&quot;, aceptas nuestros{" "}
            <a href="#" className="underline">
              términos y condiciones
            </a>{" "}
            y{" "}
            <a href="#" className="underline">
              política de privacidad
            </a>
          </span>
        
        </p>

        
        <span className="text-red-500">{ errorMessage }</span>
        <br />
        


        <button
          onClick={onPlaceOrder}
          disabled={placingOrder}
          // href="/orders/123"
          className={clsx({
            "btn-primary": !placingOrder,
            "btn-disabled": placingOrder,
          })}
        >
          Colocar orden
        </button>
      </div>
    </div>
  );
};
