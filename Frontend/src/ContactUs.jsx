import React, { useState } from "react";
import Navbar from "./components/header";
import Footer from "./components/footer";
import ChatBot from "./components/ChatBot/chatBot";

// ITGURU – Contact Us Page (Blue & White Theme)
export default function ContactUs() {
  const [status, setStatus] = useState({ state: "idle", message: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "Sending your message..." });
    await new Promise((r) => setTimeout(r, 1200));
    e.target.reset();
    setStatus({ state: "success", message: "Thanks! We received your message and will get back to you shortly." });
    setTimeout(() => setStatus({ state: "idle", message: "" }), 3500);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-blue-950">
      {/* Hero */}
      <section>
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-800">
            Contact <span className="text-blue-600">ITGURU</span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-blue-700">
            Questions about classes, payments, or your account? Send us a message and our team will respond ASAP.
          </p>
        </div>
      </section>

      {/* Content Grid */}
      <section className="mx-auto max-w-6xl px-6 pb-20 grid gap-6 md:grid-cols-5">
        {/* Left: Contact methods */}
        <aside className="md:col-span-2">
          <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold text-blue-800">Get in touch</h2>
            <p className="mt-2 text-sm text-blue-600">We usually reply within a few hours (9:00–18:00 IST).</p>

            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3">
                <CirclePhone />
                <div>
                  <p className="text-sm text-blue-600">Phone / WhatsApp</p>
                  <a href="https://wa.me/94700000000" target="_blank" rel="noreferrer" className="font-medium text-blue-800 hover:underline">
                    +94 70 000 0000
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CircleMail />
                <div>
                  <p className="text-sm text-blue-600">Email</p>
                  <a href="mailto:support@itguru.lk" className="font-medium text-blue-800 hover:underline">support@itguru.lk</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CircleMapPin />
                <div>
                  <p className="text-sm text-blue-600">Address</p>
                  <p className="font-medium text-blue-800">ITGURU HQ, Colombo, Sri Lanka</p>
                </div>
              </li>
            </ul>

            <div className="mt-6 h-px bg-blue-200" />

            <div className="mt-6 grid grid-cols-3 gap-3">
              <a href="#" className="group flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm hover:bg-blue-100">
                <XLogo /> <span className="sr-only sm:not-sr-only">X</span>
              </a>
              <a href="#" className="group flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm hover:bg-blue-100">
                <FacebookLogo /> <span className="sr-only sm:not-sr-only">Facebook</span>
              </a>
              <a href="#" className="group flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm hover:bg-blue-100">
                <InstagramLogo /> <span className="sr-only sm:not-sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Map (optional) */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-blue-200 bg-white">
            <iframe
              title="ITGURU Map"
              className="h-56 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.06397882265!2d79.7754719!3d6.9220017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2596d5f0c9a29%3A0x7a4d2f0f1e4b4c9a!2sColombo!5e0!3m2!1sen!2slk!4v1690000000000"
              allowFullScreen
            />
          </div>
        </aside>

        {/* Right: Form */}
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-blue-200 bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold text-blue-800">Send us a message</h2>
            <p className="mt-1 text-sm text-blue-600">Fill out the form and we’ll reply via email.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor="fullName" className="block text-sm text-blue-600">Full name</label>
                <input id="fullName" name="fullName" type="text" required placeholder="Savin Udana" className="mt-1 w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-blue-900 placeholder:text-blue-400 focus:border-blue-400" />
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="email" className="block text-sm text-blue-600">Email</label>
                <input id="email" name="email" type="email" required placeholder="you@example.com" className="mt-1 w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-blue-900 placeholder:text-blue-400 focus:border-blue-400" />
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="phone" className="block text-sm text-blue-600">Phone (optional)</label>
                <input id="phone" name="phone" type="tel" placeholder="07x xxx xxxx" className="mt-1 w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-blue-900 placeholder:text-blue-400 focus:border-blue-400" />
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="subject" className="block text-sm text-blue-600">Subject</label>
                <input id="subject" name="subject" type="text" required placeholder="Billing, Classes, Account..." className="mt-1 w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-blue-900 placeholder:text-blue-400 focus:border-blue-400" />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm text-blue-600">Message</label>
                <textarea id="message" name="message" required rows={6} placeholder="Tell us a bit more about what you need help with..." className="mt-1 w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-900 placeholder:text-blue-400 focus:border-blue-400" />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-blue-600">
                  <input type="checkbox" name="agree" required className="h-4 w-4 rounded border-blue-300 bg-blue-50" />
                  I agree to the <a href="#" className="underline">terms</a> and <a href="#" className="underline">privacy policy</a>.
                </label>
                <button type="submit" disabled={status.state === "loading"} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition active:scale-[.99] disabled:opacity-60">
                  {status.state === "loading" ? <Spinner /> : <SendIcon />} {status.state === "loading" ? "Sending..." : "Send message"}
                </button>
              </div>
            </div>

            {status.state !== "idle" && (
              <div role="status" className={`mt-5 rounded-xl border px-4 py-3 text-sm ${status.state === "success" ? "border-green-300 bg-green-50 text-green-800" : "border-blue-300 bg-blue-50 text-blue-800"}`}>
                {status.message}
              </div>
            )}
          </form>
        </div>
      </section>
      <ChatBot />

        <Footer />
    </main>
  );
}

/* Icons */
function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2l-7 20-4-9-9-4 20-7z" fill="currentColor" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
      <path d="M22 12a10 10 0 00-10-10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function CirclePhone() {
  return (
    <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M15.5 16.5c-2.5 1-7-3.5-6-6l1.2-1.2a1 1 0 011.4 0l1.1 1.1a1 1 0 010 1.4L12.6 12c.2 1 .9 1.8 1.9 2l.2-.2a1 1 0 011.4 0l1.1 1.1a1 1 0 010 1.4l-1.2 1.2z"/>
      </svg>
    </div>
  );
}

function CircleMail() {
  return (
    <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M7 9l5 3 5-3M7 9h10v6H7z" />
      </svg>
    </div>
  );
}

function CircleMapPin() {
  return (
    <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21s7-5.4 7-11a7 7 0 10-14 0c0 5.6 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    </div>
  );
}

function XLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="currentColor">
      <path d="M20.2 3H16l-4 5.6L7.8 3H3l6.3 8.8L3.3 21h4.2l4.6-6.5 4.7 6.5h4.2l-6.5-9.2L20.2 3z"/>
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="currentColor">
      <path d="M13 22v-9h3l1-4h-4V7.5c0-1.2.3-2 2-2H17V2.2C16.7 2.1 15.7 2 14.6 2 12 2 10.2 3.6 10.2 6.6V9H7v4h3v9h3z"/>
    </svg>
  );
}

function InstagramLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="currentColor">
      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5A5.5 5.5 0 1112 20.5 5.5 5.5 0 0112 7.5zm6-1.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z"/>
    </svg>
  );
}
