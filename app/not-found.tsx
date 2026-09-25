import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#113d22] text-white px-4 text-center">
      <h2 className="text-4xl font-black mb-3">404 - Página No Encontrada</h2>
      <p className="text-slate-200 mb-6 max-w-md text-sm sm:text-base">
        La página o propiedad que buscas no existe o ha sido reubicada.
      </p>
      <Link
        href="/"
        className="px-6 py-3.5 rounded-full bg-[#F58220] hover:bg-[#e07316] text-white font-bold text-sm transition-all shadow-lg hover:scale-105 active:scale-95"
      >
        Volver a la Página Principal
      </Link>
    </div>
  );
}
