# 数据表格

`DataTable` 封装的是 antd 自带的 `Table`，而不是无头（headless）模型。
antd Table 本身已经负责渲染、吸顶表头、虚拟滚动、可展开行与行选择，
而且它正是 antd 用户预期去配置的对象。在其上再叠一层模型只会重复这些能力，毫无收益。

`DataTable` 补充的正是 antd 没有提供的部分：工具栏、列显隐、密度、全屏、
批量操作栏，以及安全的 CSV 导出。

## 使用形态

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

列同时携带 antd 列定义与导出信息：

```ts
{
  key: 'amount',
  title: t('table.amount'),
  exportValue: (o) => o.amount,     // 不写则不导出该列
  column: { title: …, dataIndex: 'amount', sorter: true, render: … },
}
```

## 默认走服务端

分页、排序、搜索与筛选都是请求参数，而非客户端操作。
`placeholderData: keepPreviousData` 会在加载下一页时保留当前页，
避免翻页时闪出空表格。

筛选条件变化会重置到第 1 页 —— 停留在只有三页结果的第 12 页，
只会呈现一个没有任何解释的空表格。

## 分面计数

状态计数描述的是**整个筛选结果集**，而不是当前页。
只统计可见行的汇总会产生误导。

## CSV 导出已做防护

以 `=`、`+`、`-`、`@` 或控制字符开头的单元格，会被 Excel、Sheets 与 LibreOffice
当作公式执行。若不做处理，「导出」按钮就会变成用户输入内容的投递通道。

`toCsv` 会为高风险值加上单引号前缀，正确转义引号，并写入 BOM，
使 Excel 以 UTF-8 而非乱码打开。导出内容与屏幕一致 —— 当前页、当前筛选、当前可见列。

参见 [OWASP：CSV 注入](https://owasp.org/www-community/attacks/CSV_Injection)。

## 编写测试时

有两个 antd DOM 细节会实实在在浪费调试时间：

- `tbody` 中的第一个 `<tr>` 是隐藏的 `.ant-table-measure-row`，
  行选择器需限定为 `tr.ant-table-row`。
- 真正的 checkbox `<input>` 在视觉上被隐藏，应点击 `.ant-checkbox`。
