"use client";

import { useReportWebVitals } from "next/web-vitals";

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];

const logWebVitals: ReportWebVitalsCallback = (metric) => {
  const unit = metric.name === "CLS" ? "" : "ms";

  console.log(`[Web Vitals] ${metric.name}: ${metric.value}${unit} (${metric.rating})`, {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  });
};

export function WebVitals() {
  useReportWebVitals(logWebVitals);

  return null;
}
