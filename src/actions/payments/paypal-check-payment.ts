"use server";

import { PayPalOrderStatusResponse } from '@/interfaces';

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const authToken = await getPayPalBearerToken();

  if (!authToken) {
    return {
      ok: false,
      message: "No se pudo obtener token de verificación",
    };
  }

  const resp = await verifyPayPalPayment( paypalTransactionId, authToken );

  if ( !resp ) {
    return {
      ok: false,
      message: 'Error al verificar el pago'
    }
  }

  const { status, purchase_units } = resp;
  // const {  } = purchase_units[0]; // TODO: invoice ID

  if ( status !== 'COMPLETED' ) {
    return {
      ok: false,
      message: 'Aún no se ha pagado en PayPal'
    }
  }

  // TODO: Realizar la actualización en nuestra base de datos

  console.log({status, purchase_units});



};

const getPayPalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? "";

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const result = await fetch(oauth2Url, requestOptions).then((r) => r.json());
    return result.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const verifyPayPalPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PayPalOrderStatusResponse|null>  => {

  const paypalOrderUrl = `${ process.env.PAYPAL_ORDERS_URL }/${ paypalTransactionId }`;

  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${ bearerToken }`
  );

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const resp = await fetch(paypalOrderUrl,requestOptions).then( r => r.json() );
    return resp;
    
  } catch (error) {
    console.log(error);
    return null;
  }

};
