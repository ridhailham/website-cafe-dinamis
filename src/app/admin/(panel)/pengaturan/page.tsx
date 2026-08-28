import { SettingsForm } from "../../pengaturan-form";

export const metadata = {
  title: "Pengaturan — Admin Kopi Senja",
};

export default function PengaturanPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-stone-900">Pengaturan</h1>
        <p className="mt-1 text-sm text-stone-500">
          Kelola keamanan akun admin: ganti sandi, recovery key, dan perangkat
          yang login.
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}
