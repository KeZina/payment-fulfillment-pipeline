"use client";

import { useSyncExternalStore } from "react";
import { basketStore } from "./store";

export const useBasketStore = () =>
  useSyncExternalStore(
    basketStore.subscribe,
    basketStore.getState,
    basketStore.getInitialState,
  );
