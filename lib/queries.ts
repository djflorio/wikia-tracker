import "server-only";

import { db } from "./db";
import type { CategoryList } from "./types";

export async function fetchLocalCategories(siteId: number, page: number, search?: string) {
  const limit = 100;
  const searchTerms = search?.split(/\s+/).filter(Boolean) ?? [];

  const categories: CategoryList[] = await db<CategoryList>("category")
    .select("id", "text")
    .where("site_id", siteId)
    .modify((query) => {
      for (const term of searchTerms) {
        query.whereILike("text", `%${term}%`);
      }
    })
    .orderBy("text")
    .orderBy("id")
    .limit(limit + 1)
    .offset(limit * (page - 1));
  
  return {
    categories: categories.slice(0, limit),
    hasNextPage: categories.length > limit,
  };
}