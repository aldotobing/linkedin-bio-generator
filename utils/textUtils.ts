/**
 * Fungsi untuk merangkum teks dengan membatasi jumlah karakter.
 * @param text Teks asli yang ingin dirangkum.
 * @param maxLength Maksimal panjang karakter yang diizinkan.
 * @returns Teks yang diringkas.
 */
export function generateSummary(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  // Potong teks sesuai batas maksimal dan tambahkan "..." di akhir
  return text.slice(0, maxLength).trim() + "...";
}
