package com.lanchonete.mvp.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class OpcaoEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descricao;
    private String preco;
    @Column(columnDefinition = "TEXT")
    private String imagem;
    private boolean disponivel = true;
}