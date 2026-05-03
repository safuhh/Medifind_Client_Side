"use client";

import { useEffect, useState } from "react";
import {
  blockSeller,
  unblockSeller,
  getAllSellers,
} from "@/app/apis/blockseller";

type Seller = {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
};

export default function SellerAdminPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

const fetchSellers = async () => {
  try {
    setLoading(true);

    const data = await getAllSellers();

    // safety check
    setSellers(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error(err);
    alert("Failed to load sellers");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleBlock = async (id: string) => {
    try {
      setActionId(id);
      await blockSeller(id);

      setSellers((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, isBlocked: true } : s
        )
      );
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error blocking seller");
    } finally {
      setActionId(null);
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      setActionId(id);
      await unblockSeller(id);

      setSellers((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, isBlocked: false } : s
        )
      );
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error unblocking seller");
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <p className="p-6">Loading sellers...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Seller Management
      </h1>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {sellers.map((seller) => (
              <tr key={seller._id} className="border-t">
                <td className="p-3">{seller.name}</td>
                <td className="p-3">{seller.email}</td>

                <td className="p-3">
                  {seller.isBlocked ? (
                    <span className="text-red-500">Blocked</span>
                  ) : (
                    <span className="text-green-600">Active</span>
                  )}
                </td>

                <td className="p-3 text-center">
                  {seller.isBlocked ? (
                    <button
                      onClick={() => handleUnblock(seller._id)}
                      disabled={actionId === seller._id}
                      className="px-4 py-1 bg-green-600 text-white rounded"
                    >
                      {actionId === seller._id
                        ? "Unblocking..."
                        : "Unblock"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlock(seller._id)}
                      disabled={actionId === seller._id}
                      className="px-4 py-1 bg-red-600 text-white rounded"
                    >
                      {actionId === seller._id
                        ? "Blocking..."
                        : "Block"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sellers.length === 0 && (
          <p className="p-4 text-center text-gray-500">
            No sellers found
          </p>
        )}
      </div>
    </div>
  );
}