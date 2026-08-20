# 接入接口

模板内置 [MSW](https://mswjs.io)，由 `src/mocks/` 提供 `/api/*` 的响应。
同一套 handlers 同时服务 `pnpm dev`、Vitest 与线上演示 —— 只有一层 Mock，
三者不会各自漂移。

## 移除 Mock

1. 将查询指向真实接口。
2. 删除 `src/mocks/`。
3. 移除 `src/main.tsx` 中的 `enableMocking()` 调用。
4. 从 `devDependencies` 与 `build:demo` 脚本中移除 `msw`。

`pnpm build` 本就不包含 MSW，所以即使没删干净也不会影响生产包体积 ——
但在 `dev` 环境下，它会一直拦截你的请求，直到被删除为止。

## 数据请求

使用 TanStack Query，客户端配置位于 `src/app/queryClient.ts`：

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

`keepPreviousData` 正是避免翻页时闪出空表格的关键。

## 身份与权限

`src/stores/auth.ts` 保存当前角色与授权，它只是一个演示用的 store ——
持久化在 `localStorage`，背后没有任何服务端。请替换为你自己的会话，
并**在服务端强制执行同一套权限**。客户端模型只负责隐藏菜单与控制按钮，它不是安全边界。

## 错误处理

这里刻意没有提供类似 `requestErrorConfig` 的全局错误拦截。
请在你掌握上下文、能说出有用信息的位置处理错误 ——
一个只写着「请求失败」的全局提示，并不能告诉用户任何可以采取行动的内容。
