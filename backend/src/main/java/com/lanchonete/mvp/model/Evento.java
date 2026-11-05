package com.lanchonete.mvp.model;

import com.lanchonete.mvp.model.enums.EnumStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String clienteTelefone;
    private String tipoEvento;

    @Column(columnDefinition = "TEXT")
    private String imagem;

    private LocalDateTime dataHoraEvento;
    private Integer quantidade;
    private String observacao;
    private Double valorEstimado;
    private EnumStatus status;
}
