package com.lanchonete.mvp.repository;

import com.lanchonete.mvp.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    // Busca todos os eventos ordenados pela data e hora (do mais próximo ao mais distante)
    List<Evento> findAllByOrderByDataHoraEventoAsc();
}
