"use client";

import { CheckCircle2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
};

type CartLine = Product & {
  quantity: number;
};

const products: Product[] = [
  { id: "daily-pass", name: "Daily Pass", category: "Access", price: 8000 },
  { id: "weekly-pass", name: "Weekly Pass", category: "Access", price: 42000 },
  { id: "protein", name: "Protein Shake", category: "Supplement", price: 6500 },
  { id: "bcaa", name: "BCAA Sachet", category: "Supplement", price: 3500 },
  { id: "water", name: "Water Bottle", category: "Drink", price: 1000 },
  { id: "towel", name: "Towel Rental", category: "Service", price: 2500 },
];

function formatMMK(value: number) {
  return `${value.toLocaleString("en-US")} MMK`;
}

export default function POSCart() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [toast, setToast] = useState("");

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  function addItem(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function decrementItem(id: string) {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  }

  function checkout() {
    if (cart.length === 0) return;
    setCart([]);
    setToast("Checkout complete");
    window.setTimeout(() => setToast(""), 2600);
  }

  return (
    <section className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {toast ? (
        <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg">
          <CheckCircle2 size={14} />
          {toast}
        </div>
      ) : null}
      <div className="mb-5 flex items-center gap-2">
        <ShoppingCart size={18} className="text-blue-600" />
        <div>
          <h2 className="font-semibold text-slate-950">Front Desk POS</h2>
          <p className="text-xs text-slate-500">Daily passes and supplement sales</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => addItem(product)}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="text-xs font-bold uppercase text-slate-400">{product.category}</p>
              <p className="mt-1 font-semibold text-slate-900">{product.name}</p>
              <p className="mt-3 text-sm font-bold text-blue-700">{formatMMK(product.price)}</p>
            </button>
          ))}
        </div>

        <aside className="h-fit rounded-xl border border-slate-200 bg-slate-50 p-4 lg:sticky lg:top-24">
          <h3 className="font-semibold text-slate-950">Cart</h3>
          <div className="mt-4 space-y-3">
            {cart.length === 0 ? (
              <p className="rounded-xl bg-white px-3 py-4 text-center text-sm text-slate-400">
                No items added
              </p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="rounded-xl bg-white p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">{formatMMK(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => decrementItem(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500"
                        aria-label={`Remove one ${item.name}`}
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-7 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => addItem(item)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500"
                        aria-label={`Add one ${item.name}`}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">Total</span>
              <span className="text-lg font-bold text-slate-950">{formatMMK(total)}</span>
            </div>
            <button
              type="button"
              onClick={checkout}
              disabled={cart.length === 0}
              className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Checkout
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
