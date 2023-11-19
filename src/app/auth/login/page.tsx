"use client";

import Link from "next/link";
import { IoAlertOutline } from 'react-icons/io5';
import { useFormState } from "react-dom";

import { titleFont } from "@/config/fonts";
import { authenticate } from "@/actions";

import { LoginButton } from './ui/LoginButton';

export default function LoginPage() {
  const [state, dispatch] = useFormState(authenticate, undefined);



  return (
    <form
      action={dispatch}
      className="flex flex-col min-h-screen pt-32 sm:pt-52"
    >
      <h1 className={`${titleFont.className} text-4xl mb-5`}>Ingresar</h1>

      <div className="flex flex-col">
        <label htmlFor="email">Correo electrónico</label>
        <input
          className="px-5 py-2 border bg-gray-200 rounded mb-5"
          type="email"
          name="email"
        />

        <label htmlFor="email">Contraseña</label>
        <input
          className="px-5 py-2 border bg-gray-200 rounded mb-5"
          type="text"
          name="password"
        />


        <LoginButton />
        {/* <button type="submit" className="btn-primary">
          Ingresar
        </button> */}

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {state === "CredentialsSignin" && (
            <>
              <IoAlertOutline className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">Invalid credentials</p>
            </>
          )}
        </div>

        {/* divisor l ine */}
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-gray-800">O</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>

        <Link href="/auth/new-account" className="btn-secondary text-center">
          Crear una nueva cuenta
        </Link>
      </div>
    </form>
  );
}
