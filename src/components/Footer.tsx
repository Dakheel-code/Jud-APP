import Image from 'next/image';
import { Linkedin, Instagram, Youtube, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-purple-800 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="text-center md:text-right">
            <Image
              src="https://jud.sa/wp-content/uploads/2025/02/ChatGPT-Image-12-%D8%B3%D8%A8%D8%AA%D9%85%D8%A8%D8%B1-2025%D8%8C-06_53_56-%D9%85.png"
              alt="Jud Marketing & Agency"
              width={150}
              height={50}
              className="h-12 w-auto mb-4 mx-auto md:mx-0"
            />
            <p className="text-purple-200 text-sm">
              منصة احترافية لتحليل وتوقع المشتريات
            </p>
          </div>

          {/* Success Partners */}
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">كن شريكاً في النجاح</h3>
            <p className="text-purple-200 text-sm">
              نجعح خدماتك أكثر بقيمة وتقدّم خلال تعريفية بسيطة وقصب احتياجات عملك
              <br />
              وتحقيق أهدافك
            </p>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">تابعنا على منصات التواصل الاجتماعي</h3>
            <div className="flex justify-center md:justify-start gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-purple-200 text-sm">الرقم الضريبي:</span>
            <span className="text-white font-medium">310455374900003</span>
          </div>
          
          <p className="text-purple-200 text-sm">
            جميع الحقوق محفوظة © 2025، جُد للتسويق الرقمي
          </p>
        </div>
      </div>
    </footer>
  );
}
