"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { apiFetch } from "@/lib/api";
import { Spinner } from "../../../components/Spinner";

export function QpayTab({
  recipientUsername,
  amount,
  social,
  message,
  onCompleted,
}: {
  recipientUsername: string;
  amount: number;
  social: string;
  message: string;
  onCompleted: () => void;
}) {
  const router = useRouter();
  const [payUrl, setPayUrl] = useState("");
  const [error, setError] = useState("");
  const startedRef = useRef(false);

  // Create the pending QPay transaction once, then encode its public pay link.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    apiFetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientUsername,
        amount,
        specialMessage: message,
        socialURLOrBuyMeACoffee: social,
        paymentType: "QPAY",
      }),
    }).then(async (res) => {
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      const origin = window.location.origin;
      setPayUrl(`${origin}/pay/${data.transactionId}`);
    });
  }, [recipientUsername, amount, social, message, router]);

  // Poll the transaction status; advance once the QR link has been opened.
  useEffect(() => {
    if (!payUrl) return;
    const id = payUrl.split("/pay/")[1];
    const timer = setInterval(async () => {
      const res = await apiFetch(`/api/transactions/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "COMPLETED") {
        clearInterval(timer);
        onCompleted();
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [payUrl, onCompleted]);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex flex-col gap-1 px-4">
        <h3 className="text-[30px] font-semibold leading-9 tracking-[-0.75px] text-[#161616]">
          Scan QR code
        </h3>
        <p className="text-base leading-7 text-[#161616]">
          Scan the QR code to complete your donation
        </p>
      </div>

      <div className="relative flex size-[296px] items-center justify-center">
        <span className="pointer-events-none absolute left-0 top-0 size-7 rounded-tl-md border-l-2 border-t-2 border-gray-300" />
        <span className="pointer-events-none absolute right-0 top-0 size-7 rounded-tr-md border-r-2 border-t-2 border-gray-300" />
        <span className="pointer-events-none absolute bottom-0 left-0 size-7 rounded-bl-md border-b-2 border-l-2 border-gray-300" />
        <span className="pointer-events-none absolute bottom-0 right-0 size-7 rounded-br-md border-b-2 border-r-2 border-gray-300" />
        {error ? (
          <p className="px-4 text-sm text-red-500">⊗ {error}</p>
        ) : payUrl ? (
          <QRCodeSVG value={payUrl} size={240} />
        ) : (
          <Spinner />
        )}
      </div>

      {payUrl && (
        <p className="text-xs text-gray-400">
          Waiting for payment confirmation…
        </p>
      )}
    </div>
  );
}
