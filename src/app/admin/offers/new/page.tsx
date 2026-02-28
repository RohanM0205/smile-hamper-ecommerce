import Link from "next/link";
import { createCoupon } from "../actions";

export default function NewOfferPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/offers"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            ← Back to Offers
          </Link>
          <h1 className="font-serif text-3xl mt-2">
            Create New Offer
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure discount rules and usage limits
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-card border border-border rounded-2xl p-8 max-w-3xl">
        <form action={createCoupon} className="space-y-6">
          {/* Coupon Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Coupon Code
            </label>
            <input
              name="code"
              required
              placeholder="e.g. FESTIVE20"
              className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Discount Type + Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Discount Type
              </label>
              <select
                name="discount_type"
                required
                className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="percent">
                  Percentage (%)
                </option>
                <option value="flat">
                  Flat (₹)
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Discount Value
              </label>
              <input
                name="discount_value"
                type="number"
                required
                placeholder="e.g. 20"
                className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Minimum Cart + Expiry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Minimum Cart Value
              </label>
              <input
                name="min_cart_value"
                type="number"
                placeholder="Optional"
                className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Expiry Date
              </label>
              <input
                name="expiry_date"
                type="date"
                className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Global Usage Limit
              </label>
              <input
                name="usage_limit"
                type="number"
                placeholder="Optional"
                className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Per User Limit
              </label>
              <input
                name="per_user_limit"
                type="number"
                defaultValue={1}
                className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              href="/admin/offers"
              className="px-5 py-2 rounded-xl border border-border hover:bg-muted"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-xl hover:opacity-90 transition"
            >
              Create Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}