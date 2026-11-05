package com.lanchonete.mvp.service;

import com.lanchonete.mvp.model.Evento;
import com.lanchonete.mvp.model.enums.EnumStatus;
import com.lanchonete.mvp.repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventoService {

    @Autowired
    private EventoRepository repository;

    // Retorna todos os eventos ordenados por data
    public List<Evento> listarTodos() {
        return repository.findAllByOrderByDataHoraEventoAsc();
    }

    // Cria um novo agendamento de evento
    public Evento criarEvento(Evento evento) {
        // Garante que todo novo evento comece como PENDENTE
        evento.setStatus(EnumStatus.PENDENTE);
        return repository.save(evento);
    }

    // Atualiza o status de um evento (ex: de PENDENTE para CONFIRMADO)
    public Evento atualizarStatus(Long id, EnumStatus novoStatus) {
        Optional<Evento> eventoExistente = repository.findById(id);

        if (eventoExistente.isPresent()) {
            Evento evento = eventoExistente.get();
            evento.setStatus(novoStatus);
            return repository.save(evento);
        }
        throw new RuntimeException("Evento não encontrado com o ID: " + id);
    }
}