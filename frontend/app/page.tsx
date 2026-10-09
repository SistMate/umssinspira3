import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#eee9df] px-6 text-center text-[#202a3b]">
      <h1 className="text-3xl font-bold">UMSSINSPIRA</h1>
      <p className="max-w-lg text-sm text-slate-600">
        Gestiona tu trayectoria profesional y mantén actualizado tu perfil laboral.
      </p>
      <Link
        className="rounded-md bg-[#f2a45b] px-5 py-3 text-sm font-semibold text-[#2c2520] hover:bg-[#e99549]"
        href="/profile/experience"
      >
        Ir a experiencia laboral
      </Link>
    </main>
  );
}
