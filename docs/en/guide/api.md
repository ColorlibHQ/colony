# Connecting an API

The template ships with [MSW](https://mswjs.io) serving `/api/*` from
`src/mocks/`. The same handlers run in `pnpm dev`, in Vitest, and in the hosted
demo — one mock layer, so the three cannot drift apart.

## Removing the mocks

1. Point your queries at real endpoints.
2. Delete `src/mocks/`.
3. Remove the `enableMocking()` call in `src/main.tsx`.
4. Drop `msw` from `devDependencies` and the `build:demo` script.

`pnpm build` already excludes MSW, so an un-removed mock layer costs you nothing
in production — but it will intercept requests in `dev` until you delete it.

## Fetching

TanStack Query, with the client in `src/app/queryClient.ts`:

```ts
const { data, isFetching } = useQuery({
  queryKey: ['orders', params.toString()],
  queryFn: async () => {
    const res = await fetch(`/api/orders?${params}`);
    if (!res.ok) throw new Error('Failed to load orders');
    return res.json() as Promise<OrderPage>;
  },
  placeholderData: keepPreviousData,
});
```

`keepPreviousData` is what stops paging from flashing an empty table.

## Auth

`src/stores/auth.ts` holds the current role and grants. It is a demo store —
persisted to `localStorage` with no server behind it. Replace it with your
session, and **enforce the same permissions server-side**. The client model
hides menus and gates buttons; it is not a security boundary.

## Errors

`requestErrorConfig`-style global handling is deliberately absent. Handle errors
where you have the context to say something useful — a global toast reading
"Request failed" tells the user nothing they can act on.
