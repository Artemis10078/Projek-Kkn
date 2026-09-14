import React from 'react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#0f1712] text-white pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Judul Halaman */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#e8ecd7] mb-4">Kontak Kami</h1>
          <p className="text-gray-300">Hubungi kami untuk reservasi atau pertanyaan lebih lanjut.</p>
        </div>

        {/* Card Utama */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#1a241c] p-6 md:p-8 rounded-2xl border border-gray-700 shadow-xl">
          
          {/* Bagian Kiri: Informasi Kontak */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-[#e8ecd7] mb-2">Informasi Pengelola</h2>
              <p className="text-gray-400 text-sm">
                Jangan ragu untuk menghubungi kami melalui WhatsApp atau telepon langsung.
              </p>
            </div>

            {/* List Kontak */}
            <div className="space-y-6">
              {/* Kontak 1 */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center text-xl">
                  📞
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Bapak [Seto Legowo]</p>
                  <p className="text-lg font-medium text-white">+62 857-1361-0916</p>
                </div>
              </div>

              {/* Lokasi Teks */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center text-xl">
                  📍
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Alamat Lokasi</p>
                  <p className="text-md font-medium text-white">Candimulyo Park Tour</p>
                  <p className="text-gray-400 text-sm">[Taman Candimulyo karangmojo RT RW 04 02, Karang Mojo, Tamanmartani, Kec. Kalasan, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55571]</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian Kanan: Google Maps Embed */}
          <div className="w-full h-80 md:h-full min-h-[350px] rounded-xl overflow-hidden shadow-lg border border-gray-600">
            {/* GANTI src DI BAWAH INI DENGAN LINK EMBED MAPS YANG ASLI */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2044.0865343041714!2d110.48274577591056!3d-7.748243911372818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5b082729461b%3A0xb7b4f855d07f0e4d!2sJual%20bibit%20aneka%20buah%20pak%20seto!5e1!3m2!1sid!2sid!4v1789369970915!5m2!1sid!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Martani Park Tour"
              className="w-full h-full object-cover"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;