# Data table

`DataTable` wraps antd's own `Table` rather than a headless model. antd Table
already owns rendering, sticky headers, virtual scrolling, expandable rows and
selection — and it is what antd users expect to configure. A second model layer
on top would duplicate all of that for no gain.

What `DataTable` adds is what antd leaves out: a toolbar, column visibility,
density, fullscreen, a bulk action bar, and a safe CSV export.

## Shape

```tsx
<DataTable<Order>
  rows={data?.rows ?? []}
  total={data?.total ?? 0}
  loading={isFetching}
  rowKey={(o) => o.id}
  columns={columns}
  page={page} pageSize={pageSize} onPageChange={…}
  search={search} onSearchChange={…}
  onRefresh={…}
  onTableChange={handleSort}
  filters={<YourSelects />}
  bulkActions={(selected, clear) => <YourButtons />}
  exportFilename="orders.csv"
/>
```

Columns carry both the antd column and export metadata:

```ts
{
  key: 'amount',
  title: t('table.amount'),
  exportValue: (o) => o.amount,     // omit to exclude from CSV
  column: { title: …, dataIndex: 'amount', sorter: true, render: … },
}
```

## Server-side by default

Paging, sorting, search and filters are query parameters, not client-side
operations. `placeholderData: keepPreviousData` keeps the previous page rendered
while the next loads, so paging does not flash an empty table.

Filter changes reset to page 1 — staying on page 12 of a three-page result set
renders an empty table with no explanation.

## Facet counts

Status counts describe the **whole filtered set**, not the visible page. A
summary that only counted visible rows would mislead.

## CSV export is hardened

A cell starting with `=` `+` `-` `@` or a control character is executed as a
formula by Excel, Sheets and LibreOffice. Without neutralisation, an "export"
button becomes a delivery mechanism for whatever a user typed into a text field.

`toCsv` prefixes risky values with a single quote, quotes and escapes properly,
and writes a BOM so Excel reads UTF-8 rather than mojibake. It exports what is on
screen — current page, filters and visible columns.

See [OWASP: CSV Injection](https://owasp.org/www-community/attacks/CSV_Injection).

## Testing against it

Two antd DOM details cost real debugging time:

- The first `<tr>` in `tbody` is a hidden `.ant-table-measure-row`. Scope row
  selectors to `tr.ant-table-row`.
- The real checkbox `<input>` is visually hidden — click `.ant-checkbox`.
