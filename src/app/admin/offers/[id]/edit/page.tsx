import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { updateCoupon } from "../../actions";

export default async function EditPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await supabaseServer();

  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!coupon) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          Coupon not found.
        </p>
      </div>
    );
  }

  const expired =
    coupon.expiry_date &&
    new Date(coupon.expiry_date) < new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/offers"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Back to Offers
        </Link>

        <div className="flex items-center justify-between mt-2">
          <h1 className="font-serif text-3xl">
            Edit Offer
          </h1>

          {expired && (
            <span className="text-red-500 text-sm font-medium">
              Expired
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-1">
          Modify coupon details and usage settings
        </p>
      </div>

      {/* Card */}
      <div className="bg-card border border-border rounded-2xl p-8 max-w-3xl">
        <form
          action={updateCoupon.bind(
            null,
            params.id
          )}
          className="space-y-6"
        >
          {/* Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Coupon Code
            </label>
            <input
              name="code"
              defaultValue={coupon.code}
              required
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
                defaultValue={
                  coupon.discount_type
                }
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
                defaultValue={
                  coupon.discount_value
                }
                required
                className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Min Cart + Expiry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Minimum Cart Value
              </label>
              <input
                name="min_cart_value"
                type="number"
                defaultValue={
                  coupon.min_cart_value ?? ""
                }
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
                defaultValue={
                  coupon.expiry_date ?? ""
                }
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
                defaultValue={
                  coupon.usage_limit ?? ""
                }
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
                defaultValue={
                  coupon.per_user_limit
                }
                className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Status Info */}
          <div className="bg-muted rounded-xl p-4 text-sm">
            <p>
              <strong>Used:</strong>{" "}
              {coupon.used_count || 0} times
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {coupon.is_active
                ? "Active"
                : "Inactive"}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
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
              Update Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}