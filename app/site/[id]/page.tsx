import { db } from "@/lib/db";
import { connection } from "next/server";
import Form from "next/form";
import { FetchCategoriesButton } from "@/components";
import { fetchSiteCategories } from "./actions";
import { fetchLocalCategories } from "@/lib/queries";

import type { SiteDetail } from "@/lib/types";

export default async function SiteBrowser({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  const { id } = await params;
  const { search, page } = await searchParams;

  await connection();
  const site: SiteDetail | undefined = await db<SiteDetail>("site")
    .select("created_at", "id", "name", "updated_at", "url")
    .where("id", id).first();

  if (!site) {
    return <div>Site not found</div>
  }

  const parsedPage = page ? parseInt(page) : 1;

  const { categories } = await fetchLocalCategories(parseInt(id), parsedPage, search);

  return (
    <div className="flex">
      <div>
        <FetchCategoriesButton action={fetchSiteCategories.bind(null, site.id)} />
        <Form action={`/site/${site.id}`} scroll={false}>
          <label htmlFor="category-search" className="sr-only">
            Search categories
          </label>
          <input
            id="category-search"
            name="search"
            type="text"
            defaultValue={search}
            placeholder="Search categories"
            className="rounded border px-3 py-1"
          />
        </Form>
        <ul>
          {categories?.map((category) => (
            <li key={category.id}>{category.text}</li>
          ))}
        </ul>
      </div>
      <div className="flex-1">
        <h1>
          {site.name}
        </h1>
      </div>
    </div>
  );
};