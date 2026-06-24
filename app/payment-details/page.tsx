import { OnboardingHeader } from "../components/OnboardingHeader";
import { PaymentForm } from "./_components/PaymentForm";

export default function PaymentDetailsPage() {
  return (
    <div className="min-h-screen">
      <OnboardingHeader />

      <div className="mx-auto max-w-2xl px-12 py-10">
        <h1 className="mb-2 text-3xl font-bold">
          How would you like to be paid?
        </h1>
        <p className="mb-8 text-gray-500">Enter location and payment details</p>

        <PaymentForm />
      </div>
    </div>
  );
}
