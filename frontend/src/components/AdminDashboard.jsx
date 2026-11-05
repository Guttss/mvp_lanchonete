import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Utensils, TrendingUp, Plus, X, Trash2, Pencil, XCircle, LogOut, CalendarDays, MessageCircle, CheckCircle2, ListPlus } from 'lucide-react';
import AdminLogin from './AdminLogin';

export default function AdminDashboard() {
  const [autenticado, setAutenticado] = useState(() => {
    return sessionStorage.getItem('admin_logado') === 'true';
  });

  const [abaAtiva, setAbaAtiva] = useState('lanches');

  // Estados de Dados
  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [opcoesEventos, setOpcoesEventos] = useState([]);

  // Estados de Modais
  const [mostrarModalProduto, setMostrarModalProduto] = useState(false);
  const [mostrarModalOpcao, setMostrarModalOpcao] = useState(false);

  // Estados de Formulários
  const [novoProduto, setNovoProduto] = useState({ id: null, nome: '', categoria: 'Salgados', preco: '', disponivel: true });
  const [novaOpcao, setNovaOpcao] = useState({ id: null, titulo: '', descricao: '', preco: '', imagem: '', disponivel: true });

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

    fetch(`${API_URL}/eventos/todos`)
        .then(res => res.json())
        .then(data => setEventos(data))
        .catch(err => console.error("Erro ao carregar eventos:", err));

    fetch(`${API_URL}/opcoes-eventos`)
        .then(res => res.json())
        .then(data => setOpcoesEventos(data))
        .catch(err => console.error("Erro ao carregar opções de eventos:", err));
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

  // ==========================================
  // LÓGICA DA LANCHONETE (LANCHES RÁPIDOS)
  // ==========================================
  const marcarConcluido = (id) => {
    fetch(`${API_URL}/pedidos/${id}/concluir`, { method: 'PUT' }).then(() => carregarDados());
  };

  const cancelarPedido = (id) => {
    if (window.confirm("Cancelar este pedido rápido?")) {
      fetch(`${API_URL}/pedidos/${id}/cancelar`, { method: 'PUT' }).then(() => carregarDados());
    }
  };

  const alternarDisponibilidadeProduto = (produto) => {
    const produtoAtualizado = { ...produto, disponivel: !produto.disponivel };
    fetch(`${API_URL}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produtoAtualizado)
    }).then(() => carregarDados());
  };

  const excluirProduto = async (id) => {
    if (window.confirm("Excluir item do cardápio?")) {
      const response = await fetch(`${API_URL}/produtos/${id}`, { method: 'DELETE' });
      if (response.ok) {
        carregarDados();
      } else {
        alert("⚠️ Produto já está no histórico de pedidos.");
      }
    }
  };

  const salvarNovoProduto = async () => {
    if (!novoProduto.nome || !novoProduto.preco) {
      return alert('Preencha nome e preço!');
    }
    const produtoFinal = { ...novoProduto, preco: parseFloat(novoProduto.preco.toString().replace(',', '.')) };
    const response = await fetch(`${API_URL}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produtoFinal)
    });
    if (response.ok) {
      carregarDados();
      setMostrarModalProduto(false);
    }
  };

  // ==========================================
  // LÓGICA DE EVENTOS E OPÇÕES DE EVENTOS
  // ==========================================
  const atualizarStatusEvento = async (id, novoStatus) => {
    await fetch(`${API_URL}/eventos/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus })
    });
    carregarDados();
  };

  const abrirWhatsAppCliente = (telefone, tipoEvento) => {
    const numFormatado = telefone.replace(/\D/g, '');
    const texto = encodeURIComponent(`Olá! Vi que agendou um(a) ${tipoEvento} conosco. Podemos confirmar os detalhes?`);
    window.open(`https://wa.me/55${numFormatado}?text=${texto}`, '_blank');
  };

  const salvarOpcaoEvento = async () => {
    console.log("Tentando salvar:", novaOpcao);
    if (!novaOpcao.titulo || !novaOpcao.preco) {
      return alert('Preencha título e preço!');
    }

    const response = await fetch(`${API_URL}/opcoes-eventos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaOpcao)
    });

    if (response.ok) {
      carregarDados();
      setMostrarModalOpcao(false);
    } else {
      alert("Erro ao comunicar com o servidor Spring Boot.");
    }
  };

  const excluirOpcaoEvento = async (id) => {
    if (window.confirm("Excluir esta opção de evento?")) {
      const response = await fetch(`${API_URL}/opcoes-eventos/${id}`, { method: 'DELETE' });
      if (response.ok) carregarDados();
    }
  };

  const formatarData = (dataIso) => {
    if (!dataIso) return '';
    const data = new Date(dataIso);
    return data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // ==========================================
  // RENDERIZAÇÃO
  // ==========================================
  if (!autenticado) return <AdminLogin />;

  // Função para converter a imagem do computador em texto Base64
  const lidarComUploadImagem = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      const leitor = new FileReader();
      leitor.onloadend = () => {
        // O resultado é o código base64 da imagem
        setNovaOpcao({ ...novaOpcao, imagem: leitor.result });
      };
      leitor.readAsDataURL(arquivo);
    }
  };

  const pedidosPendentes = pedidos.filter(p => p.status === 'PENDENTE');
  const faturamentoHoje = pedidos.filter(p => p.status !== 'CANCELADO').reduce((acc, p) => acc + p.total, 0);

  return (
      <div className="max-w-7xl mx-auto space-y-6 p-4">

        {/* HEADER DO ADMIN */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <h2 className="text-xl font-black text-gray-800">Painel de Gestão</h2>

          <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
            <button
                onClick={() => setAbaAtiva('lanches')}
                className={`flex-1 md:px-8 py-2 text-sm font-black rounded-lg transition-all ${abaAtiva === 'lanches' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Fila Rápida (Lanches)
            </button>
            <button
                onClick={() => setAbaAtiva('eventos')}
                className={`flex-1 md:px-8 py-2 text-sm font-black rounded-lg transition-all ${abaAtiva === 'eventos' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Agenda de Eventos
            </button>
          </div>

          <button onClick={fazerLogout} className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition-colors text-sm w-full md:w-auto">
            <LogOut size={16} /> Sair
          </button>
        </div>

        {abaAtiva === 'lanches' ? (
            <>
              {/* PAINEL DE LANCHES RÁPIDOS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><Utensils size={24} /></div>
                  <div><p className="text-sm text-gray-500 font-semibold">Pendentes</p><p className="text-2xl font-black text-gray-800">{pedidosPendentes.length}</p></div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-xl text-green-600"><TrendingUp size={24} /></div>
                  <div><p className="text-sm text-gray-500 font-semibold">Vendas Hoje</p><p className="text-2xl font-black text-gray-800">R$ {faturamentoHoje.toFixed(2)}</p></div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-[2]">
                  <h2 className="text-xl font-black text-gray-800 mb-4">Fila de Preparo</h2>
                  <div className="space-y-4">
                    {pedidosPendentes.length === 0 && <p className="text-gray-400 text-sm bg-white p-6 rounded-2xl border border-gray-100 text-center">Nenhum pedido pendente.</p>}
                    {pedidosPendentes.map(pedido => (
                        <div key={pedido.id} className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-l-orange-500">
                          <div className="flex justify-between gap-4">
                            <div>
                              <h3 className="font-black text-lg text-gray-800">#{pedido.id} - {pedido.clienteNome}</h3>
                              <p className="text-orange-600 font-bold text-sm mb-2"><Clock size={14} className="inline mr-1" /> Retirar às {pedido.horarioRetirada}</p>
                              <ul className="text-gray-600 font-medium text-sm">
                                {pedido.itens && pedido.itens.map((item, idx) => (
                                    <li key={idx}>- {item.quantidade}x {item.produto?.nome}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="text-right flex flex-col justify-between items-end">
                              <p className="font-black text-lg text-gray-800 mb-3">R$ {pedido.total.toFixed(2)}</p>
                              <div className="flex gap-2">
                                <button onClick={() => cancelarPedido(pedido.id)} className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-xl font-bold hover:bg-red-100"><XCircle size={18} /> Cancelar</button>
                                <button onClick={() => marcarConcluido(pedido.id)} className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-600"><CheckCircle size={18} /> Pronto</button>
                              </div>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-black text-gray-800">Cardápio</h2>
                    <button onClick={() => { setNovoProduto({ id: null, nome: '', categoria: 'Salgados', preco: '', disponivel: true }); setMostrarModalProduto(true); }} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-blue-700 shadow-sm"><Plus size={16} /> Novo</button>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-h-[500px] overflow-y-auto">
                    {produtos.map(p => (
                        <div key={p.id} className="flex justify-between items-center p-4 border-b last:border-0 hover:bg-gray-50">
                          <div>
                            <p className={`font-bold text-gray-800 ${!p.disponivel && 'line-through text-gray-400'}`}>{p.nome}</p>
                            <p className="text-sm text-gray-500">R$ {p.preco.toFixed(2)}</p>
                          </div>
                          <div className="flex gap-2 items-center">
                            <button onClick={() => alternarDisponibilidadeProduto(p)} className={`px-3 py-1 rounded text-xs font-bold ${p.disponivel ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {p.disponivel ? 'Disponível' : 'Esgotado'}
                            </button>
                            <button onClick={() => { setNovoProduto(p); setMostrarModalProduto(true); }} className="p-1.5 rounded-md bg-gray-100 text-gray-500 hover:text-blue-600"><Pencil size={16} /></button>
                            <button onClick={() => excluirProduto(p.id)} className="p-1.5 rounded-md bg-gray-100 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
        ) : (
            /* PAINEL DE EVENTOS E ENCOMENDAS */
            <div className="flex flex-col lg:flex-row gap-6">

              {/* LADO ESQUERDO: AGENDAMENTOS */}
              <div className="flex-[2]">
                <div className="flex items-center gap-3 mb-6">
                  <CalendarDays className="text-orange-600" size={28} />
                  <h2 className="text-2xl font-black text-gray-800">Agendamentos</h2>
                </div>

                <div className="space-y-4">
                  {eventos.length === 0 && <p className="text-gray-400 text-sm bg-white p-6 rounded-2xl border border-gray-100 text-center">Nenhum evento agendado.</p>}

                  {eventos.map(evento => (
                      <div key={evento.id} className={`p-5 rounded-2xl border ${evento.status === 'CONCLUIDO' ? 'bg-gray-50 border-gray-200' : evento.status === 'CONFIRMADO' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 shadow-sm'} transition-all flex flex-col md:flex-row justify-between gap-4`}>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                      <span className={`text-xs font-black px-2 py-1 rounded uppercase tracking-wider ${evento.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-700' :
                          evento.status === 'CONFIRMADO' ? 'bg-green-200 text-green-800' :
                              evento.status === 'CANCELADO' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-200 text-gray-700'
                      }`}>
                        {evento.status}
                      </span>
                            <h3 className="font-black text-xl text-gray-800">{evento.tipoEvento}</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 font-medium">
                            <p><span className="font-bold text-gray-800">Cliente:</span> {evento.nome}</p>
                            <p><span className="font-bold text-gray-800">Telefone:</span> {evento.clienteTelefone}</p>
                            <p><span className="font-bold text-gray-800">Data/Hora:</span> {formatarData(evento.dataHoraEvento)}</p>
                            <p><span className="font-bold text-gray-800">Qtd:</span> {evento.quantidade}</p>
                          </div>

                          {evento.observacao && (
                              <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100 mt-2">
                                <p className="text-xs text-orange-800 font-bold mb-1">Observações:</p>
                                <p className="text-sm text-gray-700 italic">{evento.observacao}</p>
                              </div>
                          )}
                        </div>

                        <div className="flex flex-row md:flex-col items-end justify-center md:justify-start gap-2 min-w-[160px]">
                          <button onClick={() => abrirWhatsAppCliente(evento.clienteTelefone, evento.tipoEvento)} className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-green-600 text-sm shadow-sm">
                            <MessageCircle size={16} /> Chamar no Zap
                          </button>
                          {evento.status === 'PENDENTE' && (
                              <button onClick={() => atualizarStatusEvento(evento.id, 'CONFIRMADO')} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-blue-700 text-sm shadow-sm"><CheckCircle2 size={16} /> Confirmar</button>
                          )}
                          {evento.status === 'CONFIRMADO' && (
                              <button onClick={() => atualizarStatusEvento(evento.id, 'CONCLUIDO')} className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-gray-900 text-sm shadow-sm"><CheckCircle size={16} /> Finalizar</button>
                          )}
                          {(evento.status === 'PENDENTE' || evento.status === 'CONFIRMADO') && (
                              <button onClick={() => { if (window.confirm("Cancelar evento?")) atualizarStatusEvento(evento.id, 'CANCELADO') }} className="w-full text-red-500 text-xs font-bold hover:underline mt-1 py-1">Cancelar Evento</button>
                          )}
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              {/* LADO DIREITO: CATÁLOGO DE EVENTOS */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-black text-gray-800">Catálogo de Eventos</h2>
                  <button onClick={() => { setNovaOpcao({ id: null, titulo: '', descricao: '', preco: '', imagem: '', disponivel: true }); setMostrarModalOpcao(true); }} className="bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-orange-700 shadow-sm"><ListPlus size={16} /> Novo</button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-h-[600px] overflow-y-auto">
                  {opcoesEventos.length === 0 && <p className="text-gray-400 text-sm text-center py-6">Catálogo vazio.</p>}
                  {opcoesEventos.map(opcao => (
                      <div key={opcao.id} className="p-4 border-b last:border-0 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                          {opcao.imagem && <img src={opcao.imagem} alt={opcao.titulo} className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" />}
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-sm">{opcao.titulo}</h4>
                            <p className="text-xs text-orange-600 font-bold mb-1">{opcao.preco}</p>
                            <p className="text-xs text-gray-500 line-clamp-2">{opcao.descricao}</p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                          <button onClick={() => { setNovaOpcao(opcao); setMostrarModalOpcao(true); }} className="p-1.5 rounded-md bg-gray-100 text-gray-500 hover:text-blue-600"><Pencil size={16} /></button>
                          <button onClick={() => excluirOpcaoEvento(opcao.id)} className="p-1.5 rounded-md bg-gray-100 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>
        )}

        {/* MODAL DO PRODUTO (LANCHONETE) */}
        {mostrarModalProduto && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-xl text-gray-800">{novoProduto.id ? 'Editar Produto' : 'Novo Produto'}</h3>
                  <button onClick={() => setMostrarModalProduto(false)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
                </div>
                <div className="space-y-4">
                  <input type="text" placeholder="Nome" value={novoProduto.nome} onChange={e => setNovoProduto({ ...novoProduto, nome: e.target.value })} className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl outline-none" />
                  <div className="flex gap-4">
                    <input type="number" placeholder="Preço (R$)" value={novoProduto.preco} onChange={e => setNovoProduto({ ...novoProduto, preco: e.target.value })} className="w-full flex-1 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl outline-none" />
                    <select value={novoProduto.categoria} onChange={e => setNovoProduto({ ...novoProduto, categoria: e.target.value })} className="w-full flex-1 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl outline-none">
                      <option value="Salgados">Salgados</option><option value="Bebidas">Bebidas</option><option value="Doces">Doces</option><option value="Porções">Porções</option><option value="Combos">Combos</option><option value="Variados">Variados</option>
                    </select>
                  </div>
                  <button onClick={salvarNovoProduto} className="w-full bg-blue-600 text-white font-black py-3 rounded-xl mt-4 hover:bg-blue-700">Salvar Produto</button>
                </div>
              </div>
            </div>
        )}

        {/* MODAL DE OPÇÃO DE EVENTO */}
        {mostrarModalOpcao && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-xl text-gray-800">{novaOpcao.id ? 'Editar Evento' : 'Novo Evento'}</h3>
                  <button onClick={() => setMostrarModalOpcao(false)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Título do Serviço</label>
                    <input type="text" placeholder="Ex: Cento de Salgados" value={novaOpcao.titulo} onChange={e => setNovaOpcao({ ...novaOpcao, titulo: e.target.value })} className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl outline-none mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Texto do Preço</label>
                    <input type="text" placeholder="Ex: A partir de R$ 65,00" value={novaOpcao.preco} onChange={e => setNovaOpcao({ ...novaOpcao, preco: e.target.value })} className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl outline-none mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Foto do Evento</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={lidarComUploadImagem}
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl outline-none mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                    />
                    {novaOpcao.imagem && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-green-600 font-bold">✓ Imagem carregada com sucesso!</span>
                          <img src={novaOpcao.imagem} alt="Pré-visualização" className="w-10 h-10 object-cover rounded-lg border" />
                        </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Descrição Curta</label>
                    <textarea placeholder="Fritos ou assados na hora..." value={novaOpcao.descricao} onChange={e => setNovaOpcao({ ...novaOpcao, descricao: e.target.value })} className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl outline-none mt-1 resize-none h-20"></textarea>
                  </div>
                  <button onClick={salvarOpcaoEvento} className="w-full bg-orange-600 text-white font-black py-3 rounded-xl mt-4 hover:bg-orange-700">Salvar Evento</button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}