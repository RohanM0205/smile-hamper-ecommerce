import React from "react";
import Link from "next/link";
import Icon from "@/components/ui/AppIcon";

const footerLinks = {
  shop: [
    { id: "fl_categories", label: "All Categories", href: "/products" },
    { id: "fl_new", label: "New Arrivals", href: "/products?sort=new" },
    { id: "fl_best", label: "Best Sellers", href: "/products?sort=popular" },
    { id: "fl_occasions", label: "Shop by Occasion", href: "/products" },
    { id: "fl_recipients", label: "Shop by Recipient", href: "/products" },
  ],
  about: [
    { id: "fl_story", label: "Our Story", href: "#" },
    { id: "fl_reviews", label: "Customer Reviews", href: "#" },
    { id: "fl_blog", label: "Gift Ideas Blog", href: "#" },
    { id: "fl_careers", label: "Careers", href: "#" },
  ],
  support: [
    { id: "fl_contact", label: "Contact Us", href: "#" },
    { id: "fl_shipping", label: "Shipping Info", href: "#" },
    { id: "fl_returns", label: "Returns & Refunds", href: "#" },
    { id: "fl_faq", label: "FAQs", href: "#" },
    { id: "fl_track", label: "Track Order", href: "#" },
  ],
  legal: [
    { id: "fl_privacy", label: "Privacy Policy", href: "#" },
    { id: "fl_terms", label: "Terms of Service", href: "#" },
    { id: "fl_cookies", label: "Cookie Policy", href: "#" },
  ],
};

const socialLinks = [
  { id: "social_instagram", icon: "instagram", href: "#", label: "Instagram" },
  { id: "social_facebook", icon: "facebook", href: "#", label: "Facebook" },
  { id: "social_pinterest", icon: "pinterest", href: "#", label: "Pinterest" },
  { id: "social_whatsapp", icon: "whatsapp", href: "#", label: "WhatsApp" },
];

const paymentMethods = [
  { id: "pay_visa", name: "Visa", alt: "Visa payment accepted" },
  { id: "pay_mastercard", name: "Mastercard", alt: "Mastercard payment accepted" },
  { id: "pay_rupay", name: "RuPay", alt: "RuPay payment accepted" },
  { id: "pay_upi", name: "UPI", alt: "UPI payment accepted" },
  { id: "pay_razorpay", name: "Razorpay", alt: "Secured by Razorpay" },
];

const trustBadges = [
  { id: "trust_secure", text: "Secure Checkout", icon: "ShieldCheckIcon" },
  { id: "trust_genuine", text: "100% Genuine", icon: "CheckBadgeIcon" },
  { id: "trust_delivery", text: "Timely Delivery", icon: "TruckIcon" },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-2xl text-foreground mb-2">
              Get Gift Ideas & Exclusive Offers
            </h3>
            <p className="text-muted-foreground mb-6">
              Join our community and never miss a special occasion.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link
              href="/homepage"
              className="inline-block font-serif text-2xl tracking-tighter text-foreground"
            >
              TheSmileHamper<span className="text-primary">.</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Premium gift hampers for every occasion. Thoughtfully curated,
              beautifully presented, delivered with care.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-foreground">
                <Icon name="PhoneIcon" size={18} className="text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <Icon name="EnvelopeIcon" size={18} className="text-primary" />
                <span>hello@thesmilehamper.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon
                    name={
                      social.icon === "instagram" ?"CameraIcon"
                        : social.icon === "facebook" ?"UserGroupIcon"
                        : social.icon === "pinterest" ?"PhotoIcon" :"ChatBubbleLeftRightIcon"
                    }
                    size={18}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 uppercase text-xs tracking-wider">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 uppercase text-xs tracking-wider">
              About
            </h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 uppercase text-xs tracking-wider">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges & Payment Methods */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              {trustBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Icon
                    name={badge.icon as any}
                    size={20}
                    className="text-success"
                  />
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="px-3 py-2 bg-muted rounded-lg text-xs font-medium text-foreground"
                  title={method.alt}
                >
                  {method.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 TheSmileHamper. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;