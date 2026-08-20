import {
  ColumnHeightOutlined,
  DownloadOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Dropdown,
  Input,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import type { TableProps } from 'antd';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { downloadCsv, toCsv, type CsvColumn, type CsvValue } from './exportCsv';

export type TableDensity = 'large' | 'middle' | 'small';

export interface DataTableColumn<T> {
  key: string;
  title: string;
  /** Hidden from the column picker and always rendered (e.g. row actions). */
  locked?: boolean;
  /** Omit to exclude the column from CSV export. */
  exportValue?: (row: T) => CsvValue;
  column: NonNullable<TableProps<T>['columns']>[number];
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  total: number;
  loading?: boolean;
  rowKey: (row: T) => string;

  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;

  search: string;
  onSearchChange: (value: string) => void;

  onRefresh: () => void;
  onTableChange?: TableProps<T>['onChange'];

  /** Filter controls owned by the page, rendered into the toolbar's first row. */
  filters?: ReactNode;
  /** Actions shown when at least one row is selected. */
  bulkActions?: (selected: T[], clear: () => void) => ReactNode;
  exportFilename?: string;
  title?: string;
}

/**
 * The table layer, built on antd's Table rather than a headless model.
 *
 * antd Table already owns rendering, sticky headers, virtual scrolling,
 * expandable rows and selection, and it is what antd users expect to configure.
 * Adding a second model layer on top would duplicate that for no gain, so what
 * this contributes is everything antd leaves out: a toolbar, column visibility,
 * density, fullscreen, safe CSV export, a selection action bar and server-state
 * plumbing.
 */
export function DataTable<T>({
  columns,
  rows,
  total,
  loading,
  rowKey,
  page,
  pageSize,
  onPageChange,
  search,
  onSearchChange,
  onRefresh,
  onTableChange,
  filters,
  bulkActions,
  exportFilename = 'export.csv',
  title,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const shellRef = useRef<HTMLDivElement>(null);

  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [density, setDensity] = useState<TableDensity>('middle');
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const visibleColumns = useMemo(
    () =>
      columns
        .filter((c) => c.locked || !hidden.has(c.key))
        .map((c) => c.column),
    [columns, hidden],
  );

  const selectedRows = useMemo(
    () => rows.filter((r) => selectedKeys.includes(rowKey(r))),
    [rows, selectedKeys, rowKey],
  );

  const toggleColumn = (key: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  /**
   * Fullscreen uses the Fullscreen API on the table shell, not a fixed-position
   * div: a CSS-only version leaves the browser chrome and any antd overlay
   * portals behind, and Escape does not exit it.
   */
  const toggleFullscreen = () => {
    const el = shellRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen().then(() => setFullscreen(false));
    } else {
      void el.requestFullscreen().then(() => setFullscreen(true));
    }
  };

  const handleExport = () => {
    const csvColumns: CsvColumn<T>[] = columns
      .filter((c) => c.exportValue && (c.locked || !hidden.has(c.key)))
      .map((c) => ({ key: c.key, header: c.title, value: c.exportValue! }));
    // Exports what is on screen — the current page, filters and columns. The
    // button says "export", so it must not silently ship 240 hidden rows.
    downloadCsv(exportFilename, toCsv(rows, csvColumns));
  };

  const columnItems = columns
    .filter((c) => !c.locked)
    .map((c) => ({
      key: c.key,
      label: (
        <Checkbox
          checked={!hidden.has(c.key)}
          onClick={(e) => e.stopPropagation()}
          onChange={() => toggleColumn(c.key)}
        >
          {c.title}
        </Checkbox>
      ),
    }));

  return (
    <div
      ref={shellRef}
      style={
        fullscreen
          ? { background: 'var(--c-bg)', padding: 'var(--space-4)' }
          : undefined
      }
    >
      <Card
        styles={{ body: { padding: 0 } }}
        title={
          <Space
            wrap
            style={{
              width: '100%',
              justifyContent: 'space-between',
              paddingBlock: 8,
            }}
          >
            <Space wrap>
              {title && <Typography.Text strong>{title}</Typography.Text>}
              <Input.Search
                allowClear
                value={search}
                placeholder={t('table.searchPlaceholder')}
                style={{ width: 240 }}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {filters}
            </Space>

            <Space size={4}>
              <Tooltip title={t('action.refresh')}>
                <Button
                  type="text"
                  aria-label={t('action.refresh')}
                  icon={<ReloadOutlined />}
                  onClick={onRefresh}
                />
              </Tooltip>
              <Tooltip title={t('action.export')}>
                <Button
                  type="text"
                  aria-label={t('action.export')}
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                />
              </Tooltip>
              <Dropdown
                trigger={['click']}
                menu={{
                  items: [
                    { key: 'large', label: t('theme.density.comfortable') },
                    { key: 'middle', label: t('theme.density.compact') },
                    { key: 'small', label: t('theme.density.condensed') },
                  ],
                  selectable: true,
                  selectedKeys: [density],
                  onClick: ({ key }) => setDensity(key as TableDensity),
                }}
              >
                <Button
                  type="text"
                  aria-label={t('theme.density.label')}
                  icon={<ColumnHeightOutlined />}
                />
              </Dropdown>
              <Dropdown
                trigger={['click']}
                menu={{
                  items: [
                    ...columnItems,
                    { type: 'divider' as const },
                    { key: '__reset', label: t('table.resetColumns') },
                  ],
                  onClick: ({ key }) => {
                    if (key === '__reset') setHidden(new Set());
                  },
                }}
              >
                <Button
                  type="text"
                  aria-label={t('table.columns')}
                  icon={<SettingOutlined />}
                />
              </Dropdown>
              <Tooltip title={t('table.fullscreen')}>
                <Button
                  type="text"
                  aria-label={t('table.fullscreen')}
                  icon={
                    fullscreen ? (
                      <FullscreenExitOutlined />
                    ) : (
                      <FullscreenOutlined />
                    )
                  }
                  onClick={toggleFullscreen}
                />
              </Tooltip>
            </Space>
          </Space>
        }
      >
        {selectedKeys.length > 0 && (
          <div
            role="status"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              flexWrap: 'wrap',
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--c-info-bg)',
              borderBottom: '1px solid var(--c-border)',
            }}
          >
            <span style={{ fontSize: 'var(--text-sm)' }}>
              {t('table.selectedCount', { count: selectedKeys.length })}
            </span>
            {bulkActions?.(selectedRows, () => setSelectedKeys([]))}
            <Button
              type="link"
              size="small"
              onClick={() => setSelectedKeys([])}
            >
              {t('table.clearSelection')}
            </Button>
          </div>
        )}

        <Table<T>
          rowKey={rowKey}
          columns={visibleColumns}
          dataSource={rows}
          loading={loading}
          size={density}
          onChange={onTableChange}
          scroll={{ x: 'max-content' }}
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: setSelectedKeys,
            preserveSelectedRowKeys: true,
          }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
            showTotal: (n, range) =>
              t('table.paginationTotal', {
                from: range[0],
                to: range[1],
                total: n,
              }),
            onChange: onPageChange,
            style: { paddingInline: 'var(--space-4)' },
          }}
        />
      </Card>
    </div>
  );
}
