"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';


import type { Address, Country } from '@/interfaces';
import { useAddressStore } from '@/store';
import { deleteUserAddress, setUserAddress } from '@/actions';


type FormInputs = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  rememberAddress: boolean;
}


interface Props {
  countries: Country[];
  userStoredAddress?: Partial<Address>;
}


export const AddressForm = ({ countries, userStoredAddress = {} }: Props) => {

  const router = useRouter();
  const { handleSubmit, register, formState: { isValid }, reset } = useForm<FormInputs>({
    defaultValues: {
      ...(userStoredAddress as any),
      rememberAddress: false,
    }
  });

  const { data: session } = useSession({
    required: true,
  })

  const setAddress = useAddressStore( state => state.setAddress );
  const address = useAddressStore( state => state.address );



  useEffect(() => {
    if ( address.firstName ) {
      reset(address)
    }
  },[])
  




  const onSubmit = async( data: FormInputs ) => {
    

    const { rememberAddress, ...restAddress } = data;

    setAddress(restAddress);

    if ( rememberAddress ) {
      await setUserAddress(restAddress, session!.user.id );
    } else {
      await deleteUserAddress(session!.user.id);
    }

    router.push('/checkout');

  }



  return (
    <form onSubmit={ handleSubmit( onSubmit ) }  className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">
      <div className="flex flex-col mb-2">
        <span>Nombres</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('firstName', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Apellidos</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('lastName', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Dirección</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('address', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Dirección 2 (opcional)</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('address2') } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Código postal</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('postalCode', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Ciudad</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('city', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>País</span>
        <select className="p-2 border rounded-md bg-gray-200" { ...register('country', { required: true  }) }>
          <option value="">[ Seleccione ]</option>
          {
            countries.map( country => (
              <option key={ country.id } value={ country.id }>{ country.name }</option>
            ))
          }
        </select>
      </div>

      <div className="flex flex-col mb-2">
        <span>Teléfono</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('phone', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2 sm:mt-1">
        
        <div className="inline-flex items-center mb-10 ">
          <label
            className="relative flex cursor-pointer items-center rounded-full p-3"
            htmlFor="checkbox"
          >
            <input
              type="checkbox"
              className="border-gray-500 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
              id="checkbox"
              { ...register('rememberAddress') }
            />
            <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </label>

          <span>¿Recordar dirección?</span>
        </div>

        <button
          disabled={ !isValid }
          // href="/checkout"
          type="submit"
          // className="btn-primary flex w-full sm:w-1/2 justify-center "
          className={ clsx({
            'btn-primary': isValid,
            'btn-disabled': !isValid,
          })}
        >
          Siguiente
        </button>
      </div>
    </form>
  );
};
