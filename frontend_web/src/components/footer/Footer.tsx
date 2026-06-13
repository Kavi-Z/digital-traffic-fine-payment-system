import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "@tanstack/react-router";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {t("footer.about") || "About"}
            </h3>
            <p className="text-slate-400 text-sm">
              {t("footer.about.desc") ||
                "Sri Lanka Police Traffic Fine Management System"}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {t("footer.quicklinks") || "Quick Links"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition"
                >
                  {t("footer.home") || "Home"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition"
                >
                  {t("footer.search") || "Search Fine"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition"
                >
                  {t("footer.payment") || "Payment"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition"
                >
                  {t("footer.dispute") || "Dispute"}
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {t("footer.support") || "Support"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition"
                >
                  {t("footer.faq") || "FAQ"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition"
                >
                  {t("footer.contact") || "Contact Us"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition"
                >
                  {t("footer.privacy") || "Privacy Policy"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition"
                >
                  {t("footer.terms") || "Terms & Conditions"}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {t("footer.contactinfo") || "Contact Info"}
            </h3>
            <div className="text-sm text-slate-400 space-y-2">
              <p>
                <strong>{t("footer.email") || "Email"}:</strong>
                <br />
                <a
                  href="mailto:support@police.lk"
                  className="hover:text-white transition"
                >
                  support@police.lk
                </a>
              </p>
              <p>
                <strong>{t("footer.phone") || "Phone"}:</strong>
                <br />
                <a
                  href="tel:+94112433333"
                  className="hover:text-white transition"
                >
                  +94 11 243 3333
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-slate-700 mb-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <p>
            {t("footer.copyright") ||
              "© 2026 Sri Lanka Police. All rights reserved."}
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">
              {t("footer.facebook") || "Facebook"}
            </a>
            <a href="#" className="hover:text-white transition">
              {t("footer.twitter") || "Twitter"}
            </a>
            <a href="#" className="hover:text-white transition">
              {t("footer.instagram") || "Instagram"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
