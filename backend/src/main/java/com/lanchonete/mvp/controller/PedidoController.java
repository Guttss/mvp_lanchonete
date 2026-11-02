package com.lanchonete.mvp.controller;

import com.lanchonete.mvp.model.Pedido;
import com.lanchonete.mvp.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoService service;

    @PostMapping
    public Pedido criar(@RequestBody Pedido pedido) {
        return service.criarPedido(pedido);
    }

    @GetMapping("/todos")
    public List<Pedido> listarTodos(){
        return service.listarTodos();
    }

    @GetMapping("/pendentes")
    public List<Pedido> listarPendentes() {
        return service.listarPedidosPendentes();
    }

    @PutMapping("/{id}/concluir")
    public Pedido concluir(@PathVariable Long id) {
        return service.concluirPedido(id);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        service.cancelar(id);
        return ResponseEntity.ok().build();
    }
}
