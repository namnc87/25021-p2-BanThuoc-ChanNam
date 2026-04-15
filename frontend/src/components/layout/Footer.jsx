// Footer - Server Component (no client interaction needed)
import Link from 'next/link';
import { Pill, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white pt-14 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* About */}
          <div>
            <div className="text-2xl font-extrabold mb-4 flex items-center gap-2">
              <Pill className="w-7 h-7 text-sky-400" />
              <span className="gradient-text">PharmaHub</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Nhà thuốc trực tuyến uy tín, cung cấp thuốc chất lượng cao và dịch vụ tư vấn chuyên nghiệp.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-5 text-lg">Liên kết nhanh</h3>
            <ul className="space-y-3 text-slate-400">
              <li><Link href="#" className="hover:text-sky-400 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-sky-400"></span>Về chúng tôi</Link></li>
              <li><Link href="#" className="hover:text-sky-400 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-sky-400"></span>Chính sách bảo mật</Link></li>
              <li><Link href="#" className="hover:text-sky-400 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-sky-400"></span>Điều khoản sử dụng</Link></li>
              <li><Link href="#" className="hover:text-sky-400 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-sky-400"></span>Hướng dẫn mua hàng</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-5 text-lg">Thông tin liên hệ</h3>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-center gap-3"><span className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center"><Phone className="w-4 h-4 text-sky-400" /></span>Hotline: 1900 1234</li>
              <li className="flex items-center gap-3"><span className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center"><Mail className="w-4 h-4 text-sky-400" /></span>Email: info@pharmahub.vn</li>
              <li className="flex items-center gap-3"><span className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center"><MapPin className="w-4 h-4 text-sky-400" /></span>123 Đường ABC, Quận 1, TP.HCM</li>
              <li className="flex items-center gap-3"><span className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center"><Clock className="w-4 h-4 text-sky-400" /></span>Giờ làm việc: 5:00 ~ 22:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-8 text-center text-slate-500 text-sm">
          &copy; 2025 PharmaHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
