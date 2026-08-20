import { RobotOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Input, Space, Tag, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common/PageHeader';

/**
 * Chat surface for an assistant.
 *
 * Deliberately not built on @ant-design/x, which Ant Design Pro's chatbot page
 * uses: it is ~85 kB for what is structurally a message list and a composer,
 * and adding it would undercut the weight budget for one screen.
 *
 * The provider is a single async generator, so wiring a real backend means
 * replacing `demoProvider` and nothing else — no vendor SDK reaches the UI.
 */
export interface ChatProvider {
  send: (
    messages: ChatMessage[],
    signal: AbortSignal,
  ) => AsyncGenerator<string, void, unknown>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

/** Streams a canned reply token by token so the streaming UI is real. */
const demoProvider: ChatProvider = {
  async *send(messages, signal) {
    const last = messages.at(-1)?.content ?? '';
    const reply =
      `You asked: "${last}". This demo streams a fixed reply — swap ` +
      `demoProvider for your backend and the rest of this screen is unchanged.`;
    for (const word of reply.split(' ')) {
      if (signal.aborted) return;
      await new Promise((r) => setTimeout(r, 35));
      yield word + ' ';
    }
  },
};

const SUGGESTIONS = ['summarise', 'draft', 'explain'] as const;

export default function AssistantPage({
  provider = demoProvider,
}: {
  provider?: ChatProvider;
}) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  // Abort any in-flight stream on unmount, or it keeps writing to a dead
  // component and React logs a state-update-after-unmount warning.
  useEffect(() => () => abortRef.current?.abort(), []);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || streaming) return;

    const userMsg: ChatMessage = {
      id: `u${Date.now()}`,
      role: 'user',
      content,
    };
    const replyId = `a${Date.now()}`;
    const next = [...messages, userMsg];

    setMessages([...next, { id: replyId, role: 'assistant', content: '' }]);
    setDraft('');
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      for await (const chunk of provider.send(next, ctrl.signal)) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === replyId ? { ...m, content: m.content + chunk } : m,
          ),
        );
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  return (
    <>
      <PageHeader
        title={t('nav.assistant')}
        description={t('page.assistantDesc')}
      />

      <Card
        styles={{
          body: {
            display: 'flex',
            flexDirection: 'column',
            height: '62vh',
            padding: 0,
          },
        }}
      >
        <div
          role="log"
          aria-live="polite"
          aria-label={t('assistant.conversation')}
          style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-5)' }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                height: '100%',
                textAlign: 'center',
              }}
            >
              <Space direction="vertical" align="center" size={16}>
                <Avatar
                  size={48}
                  icon={<RobotOutlined />}
                  style={{ background: 'var(--ant-color-primary)' }}
                />
                <Typography.Text type="secondary" style={{ maxWidth: '46ch' }}>
                  {t('assistant.empty')}
                </Typography.Text>
                <Space wrap>
                  {SUGGESTIONS.map((s) => (
                    <Tag
                      key={s}
                      style={{
                        cursor: 'pointer',
                        paddingBlock: 4,
                        paddingInline: 10,
                      }}
                      onClick={() => void send(t(`assistant.suggestion.${s}`))}
                    >
                      {t(`assistant.suggestion.${s}`)}
                    </Tag>
                  ))}
                </Space>
              </Space>
            </div>
          ) : (
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    gap: 'var(--space-3)',
                    flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  <Avatar
                    icon={
                      m.role === 'user' ? <UserOutlined /> : <RobotOutlined />
                    }
                    style={{
                      flexShrink: 0,
                      background:
                        m.role === 'user'
                          ? 'var(--c-surface-sunken)'
                          : 'var(--ant-color-primary)',
                      color:
                        m.role === 'user' ? 'var(--c-text-secondary)' : '#fff',
                    }}
                  />
                  <div
                    style={{
                      maxWidth: '68ch',
                      padding: 'var(--space-3) var(--space-4)',
                      borderRadius: 'var(--radius-lg)',
                      background:
                        m.role === 'user'
                          ? 'var(--c-info-bg)'
                          : 'var(--c-surface-sunken)',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {m.content || (
                      <span style={{ color: 'var(--c-text-tertiary)' }}>
                        {t('state.loading')}…
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </Space>
          )}
        </div>

        <div
          style={{
            borderTop: '1px solid var(--c-border)',
            padding: 'var(--space-4)',
          }}
        >
          <Space.Compact style={{ width: '100%' }}>
            <Input.TextArea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t('assistant.placeholder')}
              autoSize={{ minRows: 1, maxRows: 5 }}
              aria-label={t('assistant.placeholder')}
              onPressEnter={(e) => {
                // Enter sends, Shift+Enter breaks the line — the convention every
                // chat interface uses, so muscle memory carries over.
                if (!e.shiftKey) {
                  e.preventDefault();
                  void send(draft);
                }
              }}
            />
            {streaming ? (
              <Button onClick={() => abortRef.current?.abort()}>
                {t('assistant.stop')}
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => void send(draft)}
              >
                {t('assistant.send')}
              </Button>
            )}
          </Space.Compact>
        </div>
      </Card>
    </>
  );
}
