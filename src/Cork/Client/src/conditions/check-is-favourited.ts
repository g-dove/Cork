import { client } from "../api/client.gen.js";

export async function checkIsFavourited(entityUnique: string | null): Promise<boolean> {
  if (!entityUnique) return false;

  const { data, error } = await client.get({
    url: "/umbraco/cork/api/v1/favourites",
    query: { contentType: 'content' },
    security: [{ scheme: "bearer", type: "http" }],
  });

  return (
    !error &&
    Array.isArray(data) &&
    data.some((f: any) => f.nodeKey === entityUnique)
  );
}
