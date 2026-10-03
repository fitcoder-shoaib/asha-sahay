import type { PayStatus } from '../data/payments'
import { useT } from '../i18n'

export default function StatusChip({ status }: { status: PayStatus }) {
  const { t } = useT()
  const label: Record<PayStatus, string> = {
    received: t.calendar.received,
    process: t.calendar.inProcess,
    pending: t.calendar.pending,
  }
  return <span className={`chip chip--${status}`}>{label[status]}</span>
}
