import React from "react";
import { useFormStatus } from 'react-dom';

export const LoginButton = () => {

  const { pending } = useFormStatus();



  return (
    <button 
      disabled={ pending }
      type="submit" 
      className="btn-primary disabled:bg-gray-400 transition-all" aria-disabled={pending}>
      Ingresar
    </button>
  );
};
