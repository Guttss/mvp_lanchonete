package com.lanchonete.mvp.controller;

import com.lanchonete.mvp.model.Evento;
import com.lanchonete.mvp.model.enums.EnumStatus;
import com.lanchonete.mvp.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "*")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    // Lista todos os eventos agendados
    @GetMapping("/todos")
    public List<Evento> listarEventos() {
        return eventoService.listarTodos();
    }

    // Cliente cria um novo agendamento
    @PostMapping
    public ResponseEntity<Evento> criarAgendamento(@RequestBody Evento evento) {
        Evento novoEvento = eventoService.criarEvento(evento);
        return ResponseEntity.ok(novoEvento);
    }

    // Administrador atualiza o status (ex: Confirmar, Concluir, Cancelar)
    @PutMapping("/{id}/status")
    public ResponseEntity<Evento> atualizarStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String statusStr = payload.get("status");

        try {
            EnumStatus novoStatus = EnumStatus.valueOf(statusStr.toUpperCase());
            Evento eventoAtualizado = eventoService.atualizarStatus(id, novoStatus);
            return ResponseEntity.ok(eventoAtualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Retorna erro se o status enviado for inválido
        }
    }
}
