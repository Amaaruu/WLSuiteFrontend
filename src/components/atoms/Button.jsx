import React from 'react';

// Un Átomo puro: Solo recibe propiedades (props) y no maneja lógica de negocio
const Button = ({ children, onClick, variant = 'primary', type = 'button', className = '' }) => {
  
  // Usamos Tailwind para definir los estilos según la variante
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-sapphire-600 hover:bg-sapphire-700 text-white focus:ring-sapphire-500",
    secondary: "bg-sapphire-100 hover:bg-sapphire-200 text-sapphire-900 focus:ring-sapphire-300",
    outline: "border-2 border-sapphire-600 text-sapphire-600 hover:bg-sapphire-50 focus:ring-sapphire-500"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;