package com.lanchonete.mvp.service;

import com.lanchonete.mvp.model.Pedido;
import com.lanchonete.mvp.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository repository;

    public PedidoService(PedidoRepository repository) {
        this.repository = repository;
    }

    public Pedido criarPedido(Pedido pedido) {
        pedido.setStatus("PENDENTE");
        return repository.save(pedido);
    }

    public List<Pedido> listarPedidosPendentes() {
        return repository.findAll().stream()
                .filter(p -> "PENDENTE".equals(p.getStatus()))
                .toList();
    }

    public List<Pedido> listarTodos(){
        return repository.findAll();
    }
    
    public Pedido concluirPedido(Long id) {
        Pedido pedido = repository.findById(id).orElseThrow();
        pedido.setStatus("CONCLUIDO");
        return repository.save(pedido);
    }

    public void cancelar(Long id) {
        Pedido pedido = repository.findById(id).orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        pedido.setStatus("CANCELADO");
        repository.save(pedido);
    }
}
