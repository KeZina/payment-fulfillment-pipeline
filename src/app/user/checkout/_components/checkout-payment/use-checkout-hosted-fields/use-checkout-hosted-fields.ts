"use client";

import { useEffect, useRef, useState } from "react";
import type { HostedFields } from "braintree-web/hosted-fields";
import { useSandboxClientToken } from "@/hooks/use-sandbox-client-token";
import { CheckoutPaymentInitializationState } from "@/constants";
import type {
  CheckoutPaymentFieldName,
  CheckoutPaymentInitializationState as CheckoutPaymentInitializationStateType,
} from "../checkout-payment.types";
import type { UseCheckoutHostedFieldsParams } from "./use-checkout-hosted-fields.types";
import {
  bindHostedFieldsEvents,
  clearHostedFields,
  createHostedFieldsSessionState,
  initializeHostedFieldsSession,
  setHostedFieldsDisabledState,
  teardownHostedFieldsSession,
} from "@/utils/client";

function resolveInitializationState(
  isClientTokenLoading: boolean,
  clientToken: string | undefined,
  clientTokenError: unknown,
  mountKey: string | null,
  completedMountKey: string | null,
  mountErrorKey: string | null,
): CheckoutPaymentInitializationStateType {
  if (isClientTokenLoading) {
    return CheckoutPaymentInitializationState.Loading;
  }

  if (clientTokenError || !clientToken || !mountKey) {
    return CheckoutPaymentInitializationState.Error;
  }

  if (completedMountKey === mountKey) {
    return CheckoutPaymentInitializationState.Ready;
  }

  if (mountErrorKey === mountKey) {
    return CheckoutPaymentInitializationState.Error;
  }

  return CheckoutPaymentInitializationState.Loading;
}

export function useCheckoutHostedFields({
  formId,
  isLocked,
  isSubmitting,
  onReadyChange,
  onValidityChange,
}: UseCheckoutHostedFieldsParams) {
  const hostedFieldsRef = useRef<HostedFields | null>(null);
  const touchedFieldsRef = useRef(new Set<CheckoutPaymentFieldName>());
  const teardownPromiseRef = useRef<Promise<void>>(Promise.resolve());
  const isInteractionDisabledRef = useRef(isSubmitting || isLocked);
  const onReadyChangeRef = useRef(onReadyChange);
  const onValidityChangeRef = useRef(onValidityChange);
  const {
    data: clientToken,
    error: clientTokenError,
    isLoading: isClientTokenLoading,
  } = useSandboxClientToken();
  const [completedMountKey, setCompletedMountKey] = useState<string | null>(
    null,
  );
  const [mountErrorKey, setMountErrorKey] = useState<string | null>(null);
  const [invalidFieldNames, setInvalidFieldNames] = useState<
    CheckoutPaymentFieldName[]
  >([]);
  const mountKey = clientToken ? `${formId}:${clientToken}` : null;
  const initializationState = resolveInitializationState(
    isClientTokenLoading,
    clientToken,
    clientTokenError,
    mountKey,
    completedMountKey,
    mountErrorKey,
  );

  useEffect(() => {
    onReadyChangeRef.current = onReadyChange;
    onValidityChangeRef.current = onValidityChange;
  }, [onReadyChange, onValidityChange]);

  function clear() {
    const instance = hostedFieldsRef.current;

    if (!instance) {
      return;
    }

    clearHostedFields(instance, touchedFieldsRef.current);
    setInvalidFieldNames([]);
    onValidityChangeRef.current(false);
  }

  async function tokenize() {
    const instance = hostedFieldsRef.current;

    if (!instance) {
      throw new Error("Braintree Hosted Fields are not ready.");
    }

    const payload = await instance.tokenize();

    return payload.nonce;
  }

  useEffect(() => {
    onReadyChangeRef.current(
      initializationState === CheckoutPaymentInitializationState.Ready,
    );

    if (initializationState === CheckoutPaymentInitializationState.Error) {
      onValidityChangeRef.current(false);
    }
  }, [initializationState]);

  useEffect(() => {
    if (!clientToken || !mountKey) {
      return;
    }

    const activeClientToken = clientToken;
    let cancelled = false;
    let disposeEvents: (() => void) | undefined;
    const session = createHostedFieldsSessionState();

    async function mountHostedFields() {
      try {
        await teardownPromiseRef.current;

        if (cancelled) {
          return;
        }

        touchedFieldsRef.current.clear();

        const hostedFields = await initializeHostedFieldsSession(
          session,
          activeClientToken,
        );

        if (cancelled) {
          disposeEvents?.();
          await teardownHostedFieldsSession(session);
          return;
        }

        hostedFieldsRef.current = hostedFields;

        const boundEvents = bindHostedFieldsEvents({
          formId,
          hostedFields,
          touchedFields: touchedFieldsRef.current,
          setInvalidFieldNames,
          onValidityChange: (isValid) => {
            onValidityChangeRef.current(isValid);
          },
        });
        disposeEvents = boundEvents.dispose;

        if (cancelled) {
          disposeEvents();
          await teardownHostedFieldsSession(session);
          return;
        }

        setHostedFieldsDisabledState(
          hostedFields,
          isInteractionDisabledRef.current,
        );
        boundEvents.updateValidity();
        setInvalidFieldNames([]);
        setCompletedMountKey(mountKey);
        setMountErrorKey(null);
      } catch {
        disposeEvents?.();

        await teardownHostedFieldsSession(session);

        if (!cancelled) {
          hostedFieldsRef.current = null;
          setMountErrorKey(mountKey);
        }
      }
    }

    void mountHostedFields();

    return () => {
      cancelled = true;
      disposeEvents?.();
      hostedFieldsRef.current = null;
      teardownPromiseRef.current = teardownHostedFieldsSession(session);
    };
  }, [clientToken, formId, mountKey]);

  useEffect(() => {
    const instance = hostedFieldsRef.current;
    const isInteractionDisabled = isSubmitting || isLocked;

    isInteractionDisabledRef.current = isInteractionDisabled;

    if (!instance) {
      return;
    }

    setHostedFieldsDisabledState(instance, isInteractionDisabled);
  }, [isLocked, isSubmitting]);

  return {
    clear,
    initializationState,
    invalidFieldNames,
    isReady: initializationState === CheckoutPaymentInitializationState.Ready,
    tokenize,
  };
}
