import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Utensils, TrendingUp, Plus, X, Trash2, Pencil, XCircle, LogOut } from 'lucide-react';
import AdminLogin from './AdminLogin';

export default function AdminDashboard() {
  const [autenticado, setAutenticado] = useState(() => {
    return sessionStorage.getItem('admin_logado') === 'true';
  });

  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [novoProduto, setNovoProduto] = useState({ id: null, nome: '', categoria: 'Salgados', preco: '', disponivel: true });

  const API_URL = import.meta.env.VITE_API_URL;

  const carregarDados = () => {
    if (!autenticado) return;

    fetch(`${API_URL}/produtos/todos`)
        .then(res => res.json())
        .then(data => setProdutos(data))
        .catch(err => console.error("Erro ao carregar produtos:", err));

    fetch(`${API_URL}/pedidos/todos`)
        .then(res => res.json())
        .then(data => setPedidos(data))
        .catch(err => console.error("Erro ao carregar pedidos:", err));
  };

  useEffect(() => {
    if (autenticado) {
      carregarDados();
      const interval = setInterval(carregarDados, 10000);
      return () => clearInterval(interval);
    }
  }, [autenticado]);

  const fazerLogout = () => {
    sessionStorage.removeItem('admin_logado');
    setAutenticado(false);
  };

  const marcarConcluido = (id) => {
    fetch(`${API_URL}/pedidos/${id}/concluir`, { method: 'PUT' })
        .then(() => carregarDados());
  };

  const cancelarPedido = (id) => {
    if (window.confirm("O cliente não veio buscar? Este pedido será cancelado e removido do caixa.")) {
      fetch(`${API_URL}/pedidos/${id}/cancelar`, { method: 'PUT' })
          .then(() => carregarDados());
    }
  };

  const alternarDisponibilidade = (produto) => {
    const produtoAtualizado = { ...produto, disponivel: !produto.disponivel };
    fetch(`${API_URL}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produtoAtualizado)
    }).then(() => carregarDados());
  };

  const excluirProduto = async (id) => {
    if (window.confirm("Tem a certeza que deseja excluir este item do cardápio?")) {
      try {
        const response = await fetch(`${API_URL}/produtos/${id}`, { method: 'DELETE' });
        if (response.ok) {
          carregarDados();
        } else {
          alert("⚠️ Este produto já faz parte de um pedido no seu histórico e não pode ser apagado. Use o botão 'Disponível / Esgotado'!");
        }
      } catch (error) {
        alert("Erro ao tentar excluir.");
      }
    }
  };

  const abrirModalEdicao = (produto) => {
    setNovoProduto({
      id: produto.id,
      nome: produto.nome,
      categoria: produto.categoria,
      preco: produto.preco,
      disponivel: produto.disponivel
    });
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setNovoProduto({ id: null, nome: '', categoria: 'Salgados', preco: '', disponivel: true });
  };

  const salvarNovoProduto = async () => {
    if (!novoProduto.nome || !novoProduto.preco) return alert('Preencha o nome e o preço!');

    const produtoFinal = {
      ...novoProduto,
      preco: parseFloat(novoProduto.preco.toString().replace(',', '.'))
    };

    try {
      const response = await fetch(`${API_URL}/produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produtoFinal)
      });

      if (response.ok) {
        carregarDados();
        fecharModal();
      } else {
        const erroJava = await response.text();
        alert(`❌ Erro ao salvar:\n${erroJava}`);
      }
    } catch (error) {
      alert(`⚠️ Erro de comunicação!`);
    }
  };

  // SE NÃO ESTIVER AUTENTICADO, MOSTRA O COMPONENTE DE LOGIN CORRETO
  if (!autenticado) {
    return <AdminLogin />;
  }

  const pedidosPendentes = pedidos.filter(p => p.status === 'PENDENTE');
  const faturamentoHoje = pedidos
      .filter(p => p.status !== 'CANCELADO')
      .reduce((acc, p) => acc + p.total, 0);

  return (
      <div className="max-w-5xl mx-auto space-y-6 p-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-black text-gray-800">Painel de Gestão</h2>
          <button
              onClick={fazerLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition-colors text-sm"
          >
            <LogOut size={16}/> Sair do Painel
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><Utensils size={24}/></div>
            <div><p className="text-sm text-gray-500 font-semibold">Pendentes</p><p className="text-2xl font-black text-gray-800">{pedidosPendentes.length}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-600"><TrendingUp size={24}/></div>
            <div><p className="text-sm text-gray-500 font-semibold">Vendas Hoje</p><p className="text-2xl font-black text-gray-800">R$ {faturamentoHoje.toFixed(2)}</p></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-[2]">
            <h2 className="text-xl font-black text-gray-800 mb-4">Fila de Preparo</h2>
            <div className="space-y-4">
              {pedidosPendentes.length === 0 && (
                  <p className="text-gray-400 text-sm bg-white p-6 rounded-2xl border border-gray-100 text-center">Nenhum pedido pendente no momento.</p>
              )}
              {pedidosPendentes.map(pedido => (
                  <div key={pedido.id} className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-l-orange-500">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-black text-lg text-gray-800">#{pedido.id} - {pedido.clienteNome}</h3>
                        <p className="text-orange-600 font-bold text-sm mb-2"><Clock size={14} className="inline mr-1"/> Retirar às {pedido.horarioRetirada}</p>
                        <ul className="text-gray-600 font-medium text-sm">
                          {pedido.itens && pedido.itens.map((item, idx) => <li key={idx}>- {item.quantidade}x {item.produto?.nome}</li>)}
                        </ul>
                      </div>
                      <div className="text-right flex flex-col justify-between items-end">
                        <p className="font-black text-lg text-gray-800 mb-3">R$ {pedido.total.toFixed(2)}</p>
                        <div className="flex gap-2">
                          <button onClick={() => cancelarPedido(pedido.id)} className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-xl font-bold hover:bg-red-100 transition-colors" title="Cancelar Pedido">
                            <XCircle size={18}/> Cancelar
                          </button>
                          <button onClick={() => marcarConcluido(pedido.id)} className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-600 transition-colors">
                            <CheckCircle size={18}/> Pronto
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-gray-800">Seu Cardápio</h2>
              <button onClick={() => { fecharModal(); setMostrarModal(true); }} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-blue-700 shadow-sm">
                <Plus size={16}/> Novo
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-h-[500px] overflow-y-auto">
              {produtos.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-4 border-b last:border-0 hover:bg-gray-50">
                    <div>
                      <p className={`font-bold text-gray-800 ${!p.disponivel && 'line-through text-gray-400'}`}>{p.nome}</p>
                      <p className="text-sm text-gray-500">R$ {p.preco.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                          onClick={() => alternarDisponibilidade(p)}
                          className={`px-3 py-1 rounded text-xs font-bold transition-colors ${p.disponivel ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                      >
                        {p.disponivel ? 'Disponível' : 'Esgotado'}
                      </button>
                      <button
                          onClick={() => abrirModalEdicao(p)}
                          className="p-1.5 rounded-md bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                          onClick={() => excluirProduto(p.id)}
                          className="p-1.5 rounded-md bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {mostrarModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-xl text-gray-800">
                    {novoProduto.id ? 'Editar Produto' : 'Novo Produto'}
                  </h3>
                  <button onClick={fecharModal} className="text-gray-400 hover:text-red-500"><X size={24}/></button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-gray-600 mb-1 block">Nome do Produto</label>
                    <input type="text" value={novoProduto.nome} onChange={e => setNovoProduto({...novoProduto, nome: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl outline-none focus:border-blue-500" placeholder="Ex: Hambúrguer Duplo"/>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-bold text-gray-600 mb-1 block">Preço (R$)</label>
                      <input type="number" value={novoProduto.preco} onChange={e => setNovoProduto({...novoProduto, preco: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl outline-none focus:border-blue-500" placeholder="0.00"/>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-bold text-gray-600 mb-1 block">Categoria</label>
                      <select value={novoProduto.categoria} onChange={e => setNovoProduto({...novoProduto, categoria: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl outline-none">
                        <option value="Salgados">Salgados</option>
                        <option value="Bebidas">Bebidas</option>
                        <option value="Doces">Doces</option>
                        <option value="Porções">Porções</option>
                        <option value="Combos">Combos</option>
                        <option value="Variados">Variados</option>
                      </select>
                    </div>
                  </div>

                  <button onClick={salvarNovoProduto} className="w-full bg-blue-600 text-white font-black py-3 rounded-xl mt-4 hover:bg-blue-700 shadow-md">
                    {novoProduto.id ? 'Atualizar Produto' : 'Salvar Produto'}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}