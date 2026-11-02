import React, { useState, useEffect } from 'react';
import { ShoppingCart, Clock, Plus, Minus, CheckCircle2 } from 'lucide-react';

export default function ClienteMenu() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Salgados');
  const [clienteNome, setClienteNome] = useState('');
  const [horarioRetirada, setHorarioRetirada] = useState('');
  const [mostrarCheckout, setMostrarCheckout] = useState(false);

  // VARIÁVEL DECLARADA CORRETAMENTE AQUI:
  const [pedidoEnviado, setPedidoEnviado] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const carregarProdutos = () => {
    fetch(`${API_URL}/produtos/todos`)
        .then(res => res.json())
        .then(data => setProdutos(data))
        .catch(err => console.error("Erro na API:", err));
  };

  useEffect(() => {
    carregarProdutos();
    const interval = setInterval(carregarProdutos, 5000);
    return () => clearInterval(interval);
  }, []);

  const adicionarAoCarrinho = (produto) => {
    if (!produto.disponivel) return;
    const item = carrinho.find(i => i.id === produto.id);
    if (item) {
      setCarrinho(carrinho.map(i => i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i));
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  };

  const removerDoCarrinho = (produtoId) => {
    const item = carrinho.find(i => i.id === produtoId);
    if (item.quantidade === 1) {
      setCarrinho(carrinho.filter(i => i.id !== produtoId));
      if (carrinho.length === 1) setMostrarCheckout(false);
    } else {
      setCarrinho(carrinho.map(i => i.id === produtoId ? { ...i, quantidade: i.quantidade - 1 } : i));
    }
  };

  const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  const finalizarPedido = async () => {
    if (!clienteNome || !horarioRetirada) return alert('Informe o seu nome e horário de retirada.');

    const pedidoPayload = {
      clienteNome: clienteNome,
      horarioRetirada: horarioRetirada + ":00",
      total: total,
      itens: carrinho.map(item => ({
        produto: { id: item.id },
        quantidade: item.quantidade,
        precoUnitario: item.preco
      }))
    };

    try {
      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoPayload)
      });

      if (response.ok) {
        setPedidoEnviado({
          nome: clienteNome,
          horario: horarioRetirada,
          total: total
        });

        setCarrinho([]);
        setClienteNome('');
        setHorarioRetirada('');
        setMostrarCheckout(false);
      } else {
        const erroJava = await response.text();
        alert(`❌ A API recusou o Pedido!\nMotivo: ${erroJava}`);
      }
    } catch (error) {
      alert(`⚠️ Falha de comunicação com o Back-end!\nErro: ${error.message}`);
    }
  };

  const categorias = ['Salgados', 'Bebidas', 'Doces', 'Porções', 'Combos', 'Variados'];

  return (
      <div className="max-w-md mx-auto relative pb-32 animate-fade-in p-4">

        {/* TELA DE SUCESSO / MENSAGEM PARA O CLIENTE */}
        {pedidoEnviado && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-slide-up">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-4 rounded-full text-green-600">
                    <CheckCircle2 size={48} />
                  </div>
                </div>
                <h3 className="font-black text-2xl text-gray-800">Pedido Salvo com Sucesso!</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Obrigado, <span className="font-bold text-gray-800">{pedidoEnviado.nome}</span>! O seu pedido foi enviado para a cozinha e a lanchonete está a sua espera!
                </p>
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-left space-y-1">
                  <p className="text-xs text-orange-600 font-bold uppercase">Detalhes da Retirada:</p>
                  <p className="text-gray-800 font-bold flex items-center gap-2">
                    <Clock size={16} className="text-orange-500"/> Horário: {pedidoEnviado.horario}
                  </p>
                  <p className="text-gray-800 font-bold">Total a pagar: R$ {pedidoEnviado.total.toFixed(2)}</p>
                </div>
                <button
                    onClick={() => setPedidoEnviado(null)}
                    className="w-full bg-orange-600 text-white font-black py-3.5 rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all"
                >
                  Fazer Novo Pedido / Fechar
                </button>
              </div>
            </div>
        )}

        {/* Navegação de Categorias */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categorias.map(cat => (
              <button
                  key={cat} onClick={() => setCategoriaAtiva(cat)}
                  className={`px-5 py-2.5 rounded-2xl whitespace-nowrap font-bold transition-all shadow-sm ${
                      categoriaAtiva === cat ? 'bg-orange-500 text-white scale-105' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {cat}
              </button>
          ))}
        </div>

        {/* Lista de Produtos */}
        <div className="space-y-4">
          {produtos.length === 0 && (
              <div className="text-center mt-10 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 font-medium">O cardápio está a ser atualizado...</p>
              </div>
          )}

          {produtos.filter(p => p.categoria === categoriaAtiva).map(produto => {
            const qtdNoCarrinho = carrinho.find(i => i.id === produto.id)?.quantidade || 0;
            return (
                <div key={produto.id} className={`flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 ${!produto.disponivel ? 'opacity-60' : 'hover:shadow-md'}`}>
                  <div className="flex flex-col justify-center pr-4">
                    <h3 className={`font-bold text-gray-800 text-lg leading-tight mb-1 ${!produto.disponivel ? 'line-through text-gray-500' : ''}`}>{produto.nome}</h3>
                    <p className="text-orange-600 font-black">R$ {produto.preco.toFixed(2)}</p>
                    {!produto.disponivel && <span className="text-xs text-red-500 font-bold mt-1 bg-red-50 w-max px-2 py-0.5 rounded">ESGOTADO</span>}
                  </div>

                  {produto.disponivel && (
                      <div className="flex items-center shrink-0">
                        {qtdNoCarrinho > 0 ? (
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full p-1 shadow-inner">
                              <button onClick={() => removerDoCarrinho(produto.id)} className="bg-white p-1.5 rounded-full shadow-sm text-red-500 hover:bg-gray-100"><Minus size={18}/></button>
                              <span className="w-8 text-center font-bold text-gray-700">{qtdNoCarrinho}</span>
                              <button onClick={() => adicionarAoCarrinho(produto)} className="bg-orange-500 p-1.5 rounded-full shadow-sm text-white hover:bg-orange-600"><Plus size={18}/></button>
                            </div>
                        ) : (
                            <button onClick={() => adicionarAoCarrinho(produto)} className="bg-orange-50 text-orange-600 p-3 rounded-full border border-orange-100 hover:bg-orange-100">
                              <Plus size={24}/>
                            </button>
                        )}
                      </div>
                  )}
                </div>
            );
          })}
        </div>

        {/* Modal de Checkout */}
        {mostrarCheckout && (
            <div className="fixed inset-0 bg-black/50 z-40 flex items-end justify-center p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl z-50 mb-20 animate-slide-up">
                <h3 className="font-black text-xl mb-4 text-gray-800">Finalizar Pedido</h3>
                <div className="space-y-3 mb-6 max-h-40 overflow-y-auto pr-2">
                  {carrinho.map(item => (
                      <div key={item.id} className="flex justify-between text-gray-600 text-sm border-b pb-2">
                        <span><span className="font-bold text-orange-600">{item.quantidade}x</span> {item.nome}</span>
                        <span className="font-semibold">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                      </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <input
                      type="text"
                      placeholder="Qual o seu nome?"
                      value={clienteNome}
                      onChange={(e) => setClienteNome(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  />

                  <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl">
                    <Clock className="text-orange-500 shrink-0"/>
                    <div className="flex flex-col w-full">
                      <span className="text-xs text-gray-500 font-bold mb-1">Horário de Retirada (Máx 22:00)</span>
                      <input
                          type="time"
                          lang="pt-BR"
                          max="22:00"
                          value={horarioRetirada}
                          onChange={(e) => {
                            const horaDigitada = e.target.value;
                            if (horaDigitada > "22:00") {
                              alert("O horário máximo para retirar pedidos é até as 22:00!");
                              setHorarioRetirada("22:00");
                            } else {
                              setHorarioRetirada(horaDigitada);
                            }
                          }}
                          className="w-full bg-transparent outline-none text-gray-700 font-black text-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setMostrarCheckout(false)} className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-200">Voltar</button>
                    <button onClick={finalizarPedido} className="flex-[2] bg-green-500 text-white font-black py-4 rounded-xl hover:bg-green-600 shadow-lg shadow-green-200">Confirmar</button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Botão Flutuante Inferior */}
        {carrinho.length > 0 && !mostrarCheckout && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-30">
              <button
                  onClick={() => setMostrarCheckout(true)}
                  className="w-full max-w-md mx-auto bg-orange-600 text-white rounded-2xl p-4 flex justify-between items-center shadow-2xl shadow-orange-300 hover:bg-orange-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full relative">
                    <ShoppingCart size={24} />
                    <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-xs font-black w-5 h-5 flex items-center justify-center rounded-full">{totalItens}</span>
                  </div>
                  <span className="font-semibold text-orange-50">Ver carrinho</span>
                </div>
                <span className="font-black text-xl">R$ {total.toFixed(2)}</span>
              </button>
            </div>
        )}
      </div>
  );
}