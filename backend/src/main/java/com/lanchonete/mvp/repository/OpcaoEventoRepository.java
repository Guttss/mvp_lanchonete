package com.lanchonete.mvp.repository;

import com.lanchonete.mvp.model.OpcaoEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OpcaoEventoRepository extends JpaRepository<OpcaoEvento, Long> {
}