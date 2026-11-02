import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClienteMenu from './components/ClienteMenu';
import AdminDashboard from './components/AdminDashboard';
import { Store, ChefHat } from 'lucide-react';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 pb-20">

                {/* Rotas */}
                <Routes>
                    {/* Rota do Cliente */}
                    <Route path="/" element={
                                        <>
                                            <nav className="bg-gradient-to-r from-orange-600 to-amber-500 text-white p-4 shadow-lg sticky top-0 z-50">
                                                <div className="max-w-4xl mx-auto flex items-center justify-center">
                                                    <div className="flex items-center gap-2">
                                                        <Store size={24} />
                                                        <h1 className="text-xl font-black tracking-wide">Lanches Mais Lanchonete</h1>
                                                    </div>
                                                </div>
                                            </nav>
                                            <main className="p-4 mt-2">
                                                <ClienteMenu />
                                            </main>
                                        </>
                                    } />

                    {/* Rota do Admin */}
                    <Route path="/admin" element={
                                             <>
                                                 <nav className="bg-gray-800 text-white p-4 shadow-lg sticky top-0 z-50">
                                                     <div className="max-w-5xl mx-auto flex items-center gap-2">
                                                         <ChefHat size={24} className="text-orange-500" />
                                                         <h1 className="text-xl font-black tracking-wide">Painel Gerencial</h1>
                                                     </div>
                                                 </nav>
                                                 <main className="p-4 mt-6">
                                                     <AdminDashboard />
                                                 </main>
                                             </>
                                         } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;