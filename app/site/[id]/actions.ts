"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import type { CategoryRecord, SiteRecord } from "@/lib/types";

export type FetchCategoriesState = {
  status: "idle" | "success" | "error";
  message: string;
};

const allCategoriesResponseSchema = z.object({
  continue: z.record(z.string(), z.string()).optional(),
  query: z
    .object({
      allcategories: z.array(z.object({ "*": z.string() })),
    })
    .optional(),
});

async function fetchAllCategories(siteUrl: string): Promise<string[]> {
  const baseUrl = siteUrl.trim().replace(/\/+$/, "");
  const categories: string[] = [];
  let continueParams: Record<string, string> | undefined = {};

  while (continueParams) {
    const url = new URL(`${baseUrl}/api.php`);
    url.search = new URLSearchParams({
      action: "query",
      list: "allcategories",
      aclimit: "500",
      format: "json",
      ...continueParams,
    }).toString();

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Request to ${url} failed with status ${response.status}.`);
    }

    const data = allCategoriesResponseSchema.parse(await response.json());
    categories.push(...(data.query?.allcategories.map((c) => c["*"]) ?? []));
    continueParams = data.continue;
  }

  return categories;
}

export async function fetchSiteCategories(
  siteId: number,
): Promise<FetchCategoriesState> {
  const parsedId = z.coerce.number().int().positive().safeParse(siteId);
  if (!parsedId.success) {
    return { status: "error", message: "Invalid site id." };
  }
  const id = parsedId.data;

  try {
    const site = await db<SiteRecord>("site").select("url").where("id", id).first();
    if (!site) {
      return { status: "error", message: "Site not found." };
    }

    const fetched = [...new Set(await fetchAllCategories(site.url))];

    const inserted = await db.transaction(async (trx) => {
      let count = 0;
      for (let i = 0; i < fetched.length; i += 500) {
        const rows = fetched
          .slice(i, i + 500)
          .map((text) => ({ site_id: id, text }));
        const result = await trx<CategoryRecord>("category")
          .insert(rows)
          .onConflict(["site_id", "text"])
          .ignore()
          .returning("id");
        count += result.length;
      }
      return count;
    });

    revalidatePath(`/site/${id}`);

    return {
      status: "success",
      message: `Fetched ${fetched.length} categories; added ${inserted} new.`,
    };
  } catch (error) {
    console.error("Failed to fetch site categories", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to fetch categories.",
    };
  }
}