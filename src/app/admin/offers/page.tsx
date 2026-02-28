import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import {
  toggleCoupon,
  deleteCoupon,
} from "./actions";
import DeleteButton from "./DeleteButton";

export default async function OffersPage() {
  const supabase = await supabaseServer();

  const { data: coupons } = await supabase
    .from("coupons")
    .select("*")
    .order("expiry_date", { ascending: true });

  const today = new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-2xl">
          Offers
        </h1>
        <Link
          href="/admin/offers/new"
          className="bg-primary text-white px-4 py-2 rounded-xl"
        >
          + Add Offer
        </Link>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-4">Code</th>
              <th>Discount</th>
              <th>Min Cart</th>
              <th>Expiry</th>
              <th>Usage</th>
              <th>Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons?.map((coupon) => {
              const expired =
                coupon.expiry_date &&
                new Date(coupon.expiry_date) < today;

              return (
                <tr key={coupon.id} className="border-t">
                  <td className="p-4 font-medium">
                    {coupon.code}
                  </td>

                  <td>
                    {coupon.discount_type === "percent"
                      ? `${coupon.discount_value}%`
                      : `₹${coupon.discount_value}`}
                  </td>

                  <td>
                    ₹{coupon.min_cart_value || 0}
                  </td>

                  <td>
                    {coupon.expiry_date || "-"}
                  </td>

                  <td>
                    {coupon.used_count || 0}/
                    {coupon.usage_limit || "∞"}
                  </td>

                  <td>
                    {expired ? (
                      <span className="text-red-500 font-medium">
                        Expired
                      </span>
                    ) : coupon.is_active ? (
                      <span className="text-green-600">
                        Active
                      </span>
                    ) : (
                      <span className="text-gray-500">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-4 flex gap-3">
                    <Link
                      href={`/admin/offers/${coupon.id}/edit`}
                      className="text-primary"
                    >
                      Edit
                    </Link>

                    <form
                      action={toggleCoupon.bind(
                        null,
                        coupon.id,
                        coupon.is_active
                      )}
                    >
                      <button
                        type="submit"
                        className="text-blue-600"
                      >
                        Toggle
                      </button>
                    </form>

                    <form
                      action={deleteCoupon.bind(
                        null,
                        coupon.id
                      )}
                    >
                      <DeleteButton />
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}