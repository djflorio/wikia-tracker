'use client';

import { useActionState } from "react";

import type { FetchCategoriesState } from "@/app/site/[id]/actions";

const initialState: FetchCategoriesState = { status: "idle", message: "" };

export const FetchCategoriesButton = ({
  action,
}: {
  action: (prevState: FetchCategoriesState) => Promise<FetchCategoriesState>;
}) => {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-red-100 px-3 py-1 disabled:opacity-50"
      >
        {isPending ? "Fetching categories…" : "Fetch categories"}
      </button>
      {state.message && (
        <p
          role="status"
          className={state.status === "error" ? "text-red-600" : undefined}
        >
          {state.message}
        </p>
      )}
    </form>
  );
};
