import { Card, Col, Row, Statistic } from 'antd';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';

const STATS = [
  { key: 'revenue', value: 126_560, prefix: '$' },
  { key: 'visits', value: 8_846, prefix: '' },
  { key: 'orders', value: 6_560, prefix: '' },
  { key: 'conversion', value: 78, prefix: '', suffix: '%' },
] as const;

export default function AnalysisPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('nav.analysis')} description={t('app.tagline')} />
      <Row gutter={[16, 16]}>
        {STATS.map((stat) => (
          <Col key={stat.key} xs={24} sm={12} xl={6}>
            <Card>
              <Statistic
                title={t(`stat.${stat.key}`)}
                value={stat.value}
                prefix={stat.prefix || undefined}
                suffix={'suffix' in stat ? stat.suffix : undefined}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
