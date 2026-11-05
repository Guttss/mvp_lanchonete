package com.lanchonete.mvp.controller;

import com.lanchonete.mvp.model.OpcaoEvento;
import com.lanchonete.mvp.repository.OpcaoEventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opcoes-eventos")
@CrossOrigin(origins = "*")
public class OpcaoEventoController {

    @Autowired
    private OpcaoEventoRepository repository;

    @GetMapping
    public List<OpcaoEvento> listarTodos() {
        return repository.findAll();
    }

    @PostMapping
    public OpcaoEvento salvar(@RequestBody OpcaoEvento opcao) {
        return repository.save(opcao);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}