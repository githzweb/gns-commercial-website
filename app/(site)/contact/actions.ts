"use server";

// Contact form handler. Validates on the server, blocks simple bots with a
// hidden "website" field, and emails the enquiry to GNS through Resend.
// Needs RESEND_API_KEY and CONTACT_TO_EMAIL (see .env.example). Spam
// protection with Cloudflare Turnstile is added in Phase 4.

export type ContactState = { ok: boolean; message: string; errors?: Record<string, string> } | null;

const SUBJECTS = [
  "Equipment Quotation / Pricing",
  "Custom Setup & Installation",
  "Maintenance & Servicing",
  "Spare Parts Inquiry",
  "General Inquiry",
];

const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);
const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Honeypot: real people never fill this hidden field.
  if (clean(form.get("website"), 200)) return { ok: true, message: "Thanks! We'll get back to you soon." };

  const data = {
    firstName: clean(form.get("firstName"), 80),
    lastName: clean(form.get("lastName"), 80),
    email: clean(form.get("email"), 160),
    phone: clean(form.get("phone"), 40),
    subject: clean(form.get("subject"), 80),
    message: clean(form.get("message"), 3000),
  };

  const errors: Record<string, string> = {};
  if (!data.firstName) errors.firstName = "Please enter your first name.";
  if (!data.lastName) errors.lastName = "Please enter your last name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Please enter a valid email.";
  if (!/^[+\d][\d\s-]{6,}$/.test(data.phone)) errors.phone = "Please enter a valid phone number.";
  if (data.subject && !SUBJECTS.includes(data.subject)) errors.subject = "Please choose a subject.";
  if (Object.keys(errors).length) return { ok: false, message: "Please check the highlighted fields.", errors };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    return {
      ok: false,
      message: "Our online form isn't connected yet. Please WhatsApp or call us – we'll reply quickly.",
    };
  }

  const name = `${data.firstName} ${data.lastName}`;
  const rows = [
    ["Name", name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Subject", data.subject || "-"],
    ["Message", data.message || "-"],
  ]
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><b>${k}</b></td><td>${escape(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "GNS Website <onboarding@resend.dev>",
      to: [to],
      reply_to: data.email,
      subject: `Website enquiry: ${data.subject || "General"} – ${name}`,
      html: `<p>New enquiry from the website:</p><table>${rows}</table>`,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return { ok: false, message: "Sorry, something went wrong sending your message. Please WhatsApp or call us." };
  }
  return { ok: true, message: "Thanks! Your enquiry has been sent – we'll get back to you soon." };
}
