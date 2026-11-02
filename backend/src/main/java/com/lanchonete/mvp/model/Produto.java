package com.lanchonete.mvp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    private String categoria;
    private BigDecimal preco;
    private Integer quantidadeEstoque;
    private Boolean disponivel;
}
