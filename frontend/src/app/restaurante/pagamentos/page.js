"use client";

import { useEffect, useState } from 'react';
import { loadAuthSession } from '../../../lib/session';
import { getMyPayments, markPaymentPaid } from '../../../lib/api';

export default function Page() {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = loadAuthSession();
    if (!session?.token) return;

    async function load() {
      setLoading(true);
      try {
        const list = await getMyPayments(session.token);
        setPagamentos(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleMarkPaid(id) {
    const session = loadAuthSession();
    if (!session?.token) return;

    try {
      await markPaymentPaid(session.token, id);
      setPagamentos((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert(e.message ?? 'Erro ao marcar pagamento');
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Pagamentos</h1>

      {loading ? <p>Carregando...</p> : null}

      <div className="grid gap-4">
        {pagamentos.length === 0 && !loading ? <p>Nenhum pagamento encontrado.</p> : null}

        {pagamentos.map((p) => (
          <div key={p.id} className="rounded-lg border p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Pedido #{p.pedido?.id ?? p.id_pedido ?? p.pedidoId}</div>
              <div className="text-sm text-gray-600">Cliente: {p.pedido?.pessoa?.nome ?? p.pedido?.pessoas?.nome ?? '—'}</div>
              <div className="text-sm">Valor: R$ {p.valor ?? p.valor_pago ?? '0.00'}</div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full ${p.idStatus === 2 ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                {p.idStatus === 2 ? 'Pago' : 'Pendente'}
              </span>

              {p.idStatus !== 2 ? (
                <button onClick={() => handleMarkPaid(p.id)} className="rounded bg-orange-500 px-3 py-2 text-white">Marcar como pago</button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
