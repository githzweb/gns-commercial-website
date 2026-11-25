"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { sendContact, type ContactState } from "./actions";

const SUBJECTS = [
  "Equipment Quotation / Pricing",
  "Custom Setup & Installation",
  "Maintenance & Servicing",
  "Spare Parts Inquiry",
  "General Inquiry",
];

const input = "mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink";

export function ContactForm() {
  const params = useSearchParams();
  const product = params.get("product");
  const service = params.get("service");
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, null);

  const defaultMessage = product
    ? `Hi, I'd like a quotation for: ${product}`
    : service
      ? `Hi, I'm interested in your ${service} service.`
      : "";
  const defaultSubject = product ? SUBJECTS[0] : service ? SUBJECTS[1] : "";
  const err = (k: string) => state?.errors?.[k];

  if (state?.ok) {
    return (
      <div className="rounded-2xl bg-soft p-8 text-center">
        <p className="text-lg font-semibold">✓ {state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2" noValidate>
      {/* Honeypot for bots – hidden from people */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Field label="First name*" name="firstName" error={err("firstName")} autoComplete="given-name" />
      <Field label="Last name*" name="lastName" error={err("lastName")} autoComplete="family-name" />
      <Field label="Email*" name="email" type="email" error={err("email")} autoComplete="email" />
      <Field label="Phone*" name="phone" type="tel" error={err("phone")} autoComplete="tel" />
      <label className="text-sm font-medium sm:col-span-2">
        Subject
        <select name="subject" defaultValue={defaultSubject} className={input}>
          <option value="">Select…</option>
          {SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium sm:col-span-2">
        Message
        <textarea name="message" rows={5} defaultValue={defaultMessage} maxLength={3000} className={input} />
      </label>
      {state && !state.ok && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{state.message}</p>}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-light disabled:opacity-60"
        >
          {pending ? "Sending…" : "Submit details"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <label className="text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={`${input} ${error ? "border-red-500" : ""}`}
      />
      {error && <span className="mt-1 block text-xs font-normal text-red-600">{error}</span>}
    </label>
  );
}
