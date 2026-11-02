import React, { useState } from 'react';
import { Lock, KeyRound } from 'lucide-react';

export default function AdminLogin() {
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState(false);
    const [carregando, setCarregando] = useState(false);

    // IMPORTANTE: Mantenha o mesmo IP que você usa no sistema
    const API_URL = import.meta.env.VITE_API_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        setCarregando(true);
        setErro(false);

        try {
            // Agora o React NÃO SABE a senha. Ele envia para o Java validar com o BCrypt!
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senha: senha })
            });

            if (response.ok) {
                // O Java verificou o Hash e devolveu Status 200 (Autorizado)
                sessionStorage.setItem('admin_logado', 'true');
                window.location.reload();
            } else {
                // O Java verificou o Hash e devolveu Status 401 (Senha Incorreta)
                setErro(true);
            }
        } catch (error) {
            alert("⚠️ Erro de comunicação com o servidor Spring Boot.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-xl border border-gray-100 animate-slide-up">
                <div className="flex justify-center mb-6">
                    <div className="bg-orange-100 p-4 rounded-full text-orange-600">
                        <Lock size={32} />
                    </div>
                </div>

                <h2 className="text-2xl font-black text-gray-800 text-center mb-2">Área Administrativa</h2>
                <p className="text-gray-500 text-sm text-center mb-6">Digite a senha para aceder ao painel gerencial.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-2xl focus-within:border-orange-500 transition-all">
                            <KeyRound className="text-gray-400 shrink-0" size={20} />
                            <input
                                type="password"
                                placeholder="Senha de acesso"
                                value={senha}
                                onChange={(e) => { setSenha(e.target.value); setErro(false); }}
                                className="w-full bg-transparent outline-none text-gray-700 font-bold"
                                autoFocus
                                disabled={carregando}
                            />
                        </div>
                        {erro && <p className="text-red-500 text-xs font-bold mt-2 ml-2">Senha incorreta. Tente novamente.</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={carregando}
                        className={`w-full text-white font-black py-4 rounded-2xl shadow-lg transition-all ${carregando ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200'}`}
                    >
                        {carregando ? 'Validando...' : 'Entrar no Painel'}
                    </button>
                </form>
            </div>
        </div>
    );
}