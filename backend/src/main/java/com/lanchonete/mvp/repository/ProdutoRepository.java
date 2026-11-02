package com.lanchonete.mvp.repository;

import com.lanchonete.mvp.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findByDisponivelTrue();
}
