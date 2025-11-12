- the about leqta section buttons are not wonking with navigation get started and learn more
- the sevice card is not navigating to detailed service page when clicked
- i got this error  return response.json();
  GET /en/works/non-profit-awareness-campaign 200 in 1346ms
  Error fetching project: Error: Project not found
  at eval (lib\strapi.ts:88:14)
  at async WorkDetailPage (src\app\[locale]\works\[slug]\page.tsx:25:25)
  86 |     if (!response.ok) {
  87 |         const error: ApiError = await response.json();
> 88 |         throw new Error(error.error.message || "API request failed");
|              ^
89 |     }

 when navigating to single work page

- PrivacyPolicy not working shoud be retrieved from cms
- terms and conditions is not working shoud be retrieved from cms
- the section links are not scrolling