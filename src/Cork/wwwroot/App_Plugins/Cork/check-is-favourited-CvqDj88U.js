import { c } from "./client.gen-Ce7o8kG8.js";
async function s(r) {
  if (!r) return !1;
  const { data: e, error: t } = await c.get({
    url: "/umbraco/cork/api/v1/favourites",
    query: { contentType: "content" },
    security: [{ scheme: "bearer", type: "http" }]
  });
  return !t && Array.isArray(e) && e.some((a) => a.nodeKey === r);
}
export {
  s as c
};
//# sourceMappingURL=check-is-favourited-CvqDj88U.js.map
