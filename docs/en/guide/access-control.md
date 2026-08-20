# Access control

Ant Design Pro ships `access.ts` — a map of booleans — and no interface for it.
The only way to learn what a role can do is to read the source. Here the model is
data, so it can be rendered, edited and tested.

## The model

```ts
type Permission = `${Resource}:${Action}`;   // 'orders:update'

DEFAULT_GRANTS: Record<Role, Permission[]>
ROUTE_PERMISSIONS: Record<string, Permission>
```

Nothing asks *"is this user an admin"*, only *"may this user do this"* — so
adding a role never means hunting for hardcoded role checks.

## Using it

```tsx
// Component gate — hides rather than disables. A disabled control still
// advertises a capability the user does not have.
<Can permission="orders:delete">
  <Button danger>Delete</Button>
</Can>

// Imperative
const can = useCan();
if (can('orders:update')) { /* … */ }
```

Routes are guarded by `<RequirePermission>`, which reads `ROUTE_PERMISSIONS` and
redirects to `/403` with the refused path in route state so the wall can name it.

## Two decisions worth knowing

**Unlisted routes are open.** A route with no `ROUTE_PERMISSIONS` entry is
reachable. For a template this is the safer failure: a forgotten entry shows a
page, which gets noticed and reported, rather than silently hiding a feature
nobody can explain. If you need deny-by-default, invert one line in
`canAccessRoute`.

**`/403` is not guarded.** Redirecting a denied user there only works if it is
always reachable — a guarded 403 redirects to itself forever.

## The matrix page

`/access` renders roles × resources × actions. Flipping a checkbox immediately
hides the sidebar entry, stops the command palette offering the page, and makes
the route redirect — no reload.

::: tip Editing a role and being a role are separate
The matrix selector chooses which role you are *editing*. Changing who you *are*
is a distinct "Act as" action that confirms first when the target role could not
get back to this page.

This was a real bug: binding the selector to the signed-in role meant clicking
"Editor" made you one, and since editors lack `users:view` the guard instantly
bounced you to `/403` — with the page you needed to undo it being the page you
had just lost.
:::

## Wiring a real backend

The client-side model is for **rendering** — hiding menus, gating buttons,
redirecting routes. It is not a security boundary. Enforce the same permissions
on your server; anything else is a UI convenience that a devtools console can
undo.
