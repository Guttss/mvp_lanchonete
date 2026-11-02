package com.lanchonete.mvp.repository;

import com.lanchonete.mvp.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}
