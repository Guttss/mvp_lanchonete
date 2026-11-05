import React, { useState, useEffect } from 'react';
import { MessageCircle, X, CheckCircle, CalendarDays } from 'lucide-react';

export default function EventosMenu() {
    const [modalAberto, setModalAberto] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [opcoesEventos, setOpcoesEventos] = useState([]);

    const [form, setForm] = useState({
        nome: '',
        clienteTelefone: '',
        tipoEvento: '',
        dataHoraEvento: '',
        quantidade: '',
        observacao: ''
    });

    const API_URL = import.meta.env.VITE_API_URL;

    // Carrega as opções de eventos do Banco de Dados
    useEffect(() => {
        fetch(`${API_URL}/opcoes-eventos`)
            .then(res => res.json())
            .then(data => {
                // Filtra para mostrar apenas os que estão marcados como disponíveis
                setOpcoesEventos(data.filter(opcao => opcao.disponivel));
            })
            .catch(err => console.error("Erro ao carregar eventos:", err));
    }, [API_URL]);

    const abrirModal = (tipo) => {
        setForm({ ...form, tipoEvento: tipo });
        setModalAberto(true);
    };

    const enviarAgendamento = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/eventos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (response.ok) {
                setModalAberto(false);
                setSucesso(true);
                setForm({ nome: '', clienteTelefone: '', tipoEvento: '', dataHoraEvento: '', quantidade: '', observacao: '' });
            }
        } catch (error) {
            alert("Erro ao conectar com o servidor.");
        }
    };

    const chamarNoWhatsapp = () => {
        const numeroZap = "553491150314";
        const texto = encodeURIComponent("Olá! Gostaria de fazer um orçamento personalizado para um evento.");
        window.open(`https://wa.me/${numeroZap}?text=${texto}`, '_blank');
    };

    if (sucesso) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl shadow-sm border border-gray-100 mt-6">
                <CheckCircle size={64} className="text-green-500 mb-4" />
                <h2 className="text-2xl font-black text-gray-800 mb-2">Pedido Recebido!</h2>
                <p className="text-gray-600 mb-6">A nossa equipa entrará em contato pelo WhatsApp para confirmar a data e o pagamento do sinal.</p>
                <button onClick={() => setSucesso(false)} className="bg-orange-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-700">
                    Fazer novo agendamento
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#1a120b] p-6 md:p-10 rounded-3xl mt-2 pb-10 shadow-2xl relative overflow-hidden animate-fade-in">

            {/* Detalhes de fundo */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-900/20 rounded-full blur-3xl"></div>

            {/* Cabeçalho */}
            <div className="text-center mb-10 relative z-10">
                <h2 className="text-xl md:text-2xl font-black text-orange-50 tracking-widest uppercase mb-1">Cardápio de</h2>
                <h2 className="text-3xl md:text-5xl text-orange-400 font-serif italic mb-2">Encomendas</h2>
                <div className="w-20 h-1 bg-orange-800/50 mx-auto rounded-full"></div>
            </div>

            {/* GRELHA RESPONSIVA DOS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pl-4 pr-2 relative z-10">

                {opcoesEventos.length === 0 && (
                    <p className="text-orange-200/50 text-center col-span-full py-8">Nenhum evento disponível no momento.</p>
                )}

                {opcoesEventos.map((opcao) => (
                    <div
                        key={opcao.id}
                        className="relative bg-[#261a12] rounded-r-3xl rounded-l-xl p-4 shadow-xl border border-orange-900/30 flex items-center min-h-[120px]"
                    >
                        {/* Imagem circular vazando */}
                        {opcao.imagem ? (
                            <img
                                src={opcao.imagem}
                                alt={opcao.titulo}
                                className="absolute -left-6 w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-[0_4px_15px_rgba(0,0,0,0.5)] border-4 border-[#1a120b]"
                            />
                        ) : (
                            <div className="absolute -left-6 w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1a120b] flex items-center justify-center border-4 border-[#261a12] text-orange-900 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                                <CalendarDays size={32} />
                            </div>
                        )}

                        {/* Conteúdo de Texto */}
                        <div className="ml-16 md:ml-20 w-full">
                            <h3 className="text-orange-200 font-serif italic text-lg md:text-xl mb-1">{opcao.titulo}</h3>
                            <p className="text-gray-400 text-xs leading-snug mb-3 pr-2 opacity-80">
                                {opcao.descricao}
                            </p>

                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <span className="text-orange-500/80 font-semibold text-xs italic">{opcao.preco}</span>

                                <button
                                    onClick={() => abrirModal(opcao.titulo)}
                                    className="bg-transparent border border-orange-500/50 text-orange-400 text-xs font-bold uppercase px-3 py-1.5 rounded-full hover:bg-orange-500 hover:text-white transition-all flex items-center gap-1 ml-auto"
                                >
                                    <CalendarDays size={14} /> Agendar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Banner do WhatsApp no rodapé */}
            <div className="mt-12 bg-[#261a12] border border-green-900/30 rounded-2xl p-6 text-center md:flex md:items-center md:justify-between md:text-left relative z-10">
                <div>
                    <h3 className="text-xl font-black text-gray-200 mb-1">Orçamento Especial?</h3>
                    <p className="text-gray-400 text-sm">Festas grandes, casamentos ou dúvidas sob medida.</p>
                </div>
                <button onClick={chamarNoWhatsapp} className="mt-4 md:mt-0 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-900/20 shrink-0">
                    <MessageCircle size={20} /> Falar no WhatsApp
                </button>
            </div>

            {/* Modal de Formulário */}
            {modalAberto && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-slide-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black text-xl text-gray-800">Agendar: <span className="text-orange-600">{form.tipoEvento}</span></h3>
                            <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-red-500 bg-gray-100 p-2 rounded-full"><X size={20}/></button>
                        </div>

                        <form onSubmit={enviarAgendamento} className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-600 block mb-1">O seu Nome</label>
                                <input required type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-orange-500" placeholder="Ex: Maria Silva" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-600 block mb-1">WhatsApp de Contacto</label>
                                <input required type="text" value={form.clienteTelefone} onChange={e => setForm({...form, clienteTelefone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-orange-500" placeholder="(34) 9 9999-9999" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-[2]">
                                    <label className="text-sm font-bold text-gray-600 block mb-1">Data e Hora</label>
                                    <input required type="datetime-local" value={form.dataHoraEvento} onChange={e => setForm({...form, dataHoraEvento: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-orange-500" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-bold text-gray-600 block mb-1">Qtd</label>
                                    <input required type="text" value={form.quantidade} onChange={e => setForm({...form, quantidade: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-orange-500" placeholder="Ex: 200" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-600 block mb-1">Observações / Sabores</label>
                                <textarea value={form.observacao} onChange={e => setForm({...form, observacao: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-orange-500 resize-none h-24" placeholder="Ex: Metade coxinha, metade pastel..."></textarea>
                            </div>

                            <button type="submit" className="w-full bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200">
                                Confirmar Solicitação
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}