"use client";

import { Search } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

import {
  CyberBadge,
  CyberButton,
  CyberCard,
  CyberCardContent,
  CyberInput,
  CyberNativeSelect,
} from "@/components/cyber";
import { type AuthOrder } from "@/lib/auth";
import { type Dictionary, type Locale } from "@/lib/i18n";

type ProfileDictionary = Dictionary["profile"];
type OrderStatusFilter = "all" | "active" | "new" | "confirmed" | "processing" | "shipped" | "delivered" | "canceled";
type OrderSortKey = "newest" | "oldest" | "totalDesc" | "totalAsc";

const activeOrderStatuses = new Set(["new", "confirmed", "processing", "shipped"]);

interface ProfileOrdersPanelProps {
  locale: Locale;
  profile: ProfileDictionary;
  orders: AuthOrder[];
  catalogHref: string;
}

function formatMoney(value: string, currency: string) {
  return `${value} ${currency}`;
}

function getOrderStatusLabel(status: string, profile: ProfileDictionary) {
  const labels = profile.orderStatuses as Record<string, string>;
  return labels[status] ?? status;
}

export function ProfileOrdersPanel({
  locale,
  profile,
  orders,
  catalogHref,
}: ProfileOrdersPanelProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");
  const [sort, setSort] = useState<OrderSortKey>("newest");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredOrders = useMemo(() => {
    const byStatus = orders.filter((order) => {
      if (statusFilter === "all") {
        return true;
      }

      if (statusFilter === "active") {
        return activeOrderStatuses.has(order.status);
      }

      return order.status === statusFilter;
    });

    const byQuery = deferredQuery
      ? byStatus.filter((order) => {
          const haystack = [
            order.number,
            order.status,
            order.customer_name,
            order.customer_email,
            ...order.items.flatMap((item) => [
              item.product_name,
              item.product_sku,
              item.selected_color_name,
            ]),
          ]
            .join(" ")
            .toLowerCase();

          return haystack.includes(deferredQuery);
        })
      : byStatus;

    return byQuery.toSorted((left, right) => {
      if (sort === "oldest") {
        return new Date(left.created_at).getTime() - new Date(right.created_at).getTime();
      }

      if (sort === "totalDesc") {
        return Number(right.total) - Number(left.total);
      }

      if (sort === "totalAsc") {
        return Number(left.total) - Number(right.total);
      }

      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
    });
  }, [deferredQuery, orders, sort, statusFilter]);

  const hasFilters = query.trim() || statusFilter !== "all" || sort !== "newest";

  return (
    <CyberCard variant="glass" className="border border-white/10 bg-zinc-950/80">
      <CyberCardContent className="space-y-6 p-5 sm:p-7">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CyberBadge variant="neutral">
              {profile.ordersBadge}
            </CyberBadge>
            <p className="mt-4 font-display text-2xl uppercase tracking-[0.08em] text-white sm:text-3xl">
              {profile.ordersTitle}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-[15px]">
              {profile.ordersSubtitle}
            </p>
          </div>
          <CyberButton asChild variant="ghost">
            <a href={catalogHref}>
              {profile.catalogLabel}
            </a>
          </CyberButton>
        </div>

        {orders.length ? (
          <>
            <div className="grid gap-4 rounded-md border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_220px_220px_auto] xl:items-end">
              <CyberInput
                label={profile.ordersSearchLabel}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={profile.ordersSearchPlaceholder}
                icon={<Search aria-hidden="true" />}
              />
              <CyberNativeSelect
                label={profile.ordersStatusFilterLabel}
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as OrderStatusFilter)}
                options={[
                  { value: "all", label: profile.orderStatusFilters.all },
                  { value: "active", label: profile.orderStatusFilters.active },
                  { value: "new", label: profile.orderStatusFilters.new },
                  { value: "confirmed", label: profile.orderStatusFilters.confirmed },
                  { value: "processing", label: profile.orderStatusFilters.processing },
                  { value: "shipped", label: profile.orderStatusFilters.shipped },
                  { value: "delivered", label: profile.orderStatusFilters.delivered },
                  { value: "canceled", label: profile.orderStatusFilters.canceled },
                ]}
              />
              <CyberNativeSelect
                label={profile.ordersSortLabel}
                value={sort}
                onValueChange={(value) => setSort(value as OrderSortKey)}
                options={[
                  { value: "newest", label: profile.orderSortOptions.newest },
                  { value: "oldest", label: profile.orderSortOptions.oldest },
                  { value: "totalDesc", label: profile.orderSortOptions.totalDesc },
                  { value: "totalAsc", label: profile.orderSortOptions.totalAsc },
                ]}
              />
              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                <div className="font-tech text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                  {filteredOrders.length} {profile.ordersResultsLabel}
                </div>
                {hasFilters ? (
                  <CyberButton
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setQuery("");
                      setStatusFilter("all");
                      setSort("newest");
                    }}
                  >
                    {profile.ordersResetFiltersLabel}
                  </CyberButton>
                ) : null}
              </div>
            </div>

            {filteredOrders.length ? (
              <div className="grid gap-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="grid gap-5 rounded-md border border-white/10 bg-white/[0.03] p-4 sm:p-5 xl:grid-cols-[280px_minmax(0,1fr)]"
                  >
                    <div className="min-w-0 space-y-3 border-b border-white/10 pb-4 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="break-all font-display text-lg uppercase tracking-[0.08em] text-white sm:text-xl">
                          {order.number}
                        </p>
                        <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-zinc-200">
                          {getOrderStatusLabel(order.status, profile)}
                        </span>
                      </div>
                      <div className="grid gap-2 text-sm text-zinc-300">
                        <p>
                          {profile.orderDateLabel}:{" "}
                          <span className="text-zinc-100">
                            {new Intl.DateTimeFormat(locale, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(new Date(order.created_at))}
                          </span>
                        </p>
                        <p>
                          {profile.orderTotalLabel}:{" "}
                          <span className="text-zinc-100">
                            {formatMoney(order.total, order.currency)}
                          </span>
                        </p>
                        <p>
                          {profile.orderDiscountLabel}:{" "}
                          <span className="text-amber-200">
                            {formatMoney(order.discount_total, order.currency)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="grid min-w-0 gap-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="grid gap-3 rounded-md border border-white/8 bg-surface/25 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                        >
                          <div className="min-w-0">
                            <p className="break-words text-sm uppercase tracking-[0.08em] text-zinc-100">
                              {item.product_name}
                            </p>
                            <p className="mt-1 break-all text-xs uppercase tracking-[0.12em] text-zinc-500">
                              SKU: {item.product_sku}
                            </p>
                            {item.selected_color_name ? (
                              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-zinc-400">
                                Цвет: {item.selected_color_name}
                              </p>
                            ) : null}
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-sm text-zinc-300">
                              {profile.orderQuantityLabel}: {item.quantity}
                            </p>
                            <p className="mt-1 text-sm text-zinc-100">
                              {formatMoney(item.line_total, item.currency)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-white/15 bg-white/[0.03] px-6 py-12 text-center sm:px-8 sm:py-14">
                <p className="font-display text-2xl uppercase tracking-[0.08em] text-white">
                  {profile.ordersNoResultsTitle}
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
                  {profile.ordersNoResultsText}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-md border border-dashed border-white/15 bg-white/[0.03] px-6 py-12 text-center sm:px-8 sm:py-14">
            <p className="font-display text-2xl uppercase tracking-[0.08em] text-white">
              {profile.ordersEmptyTitle}
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
              {profile.ordersEmptyText}
            </p>
          </div>
        )}
      </CyberCardContent>
    </CyberCard>
  );
}
