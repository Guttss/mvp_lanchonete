package com.lanchonete.mvp.service;

import com.lanchonete.mvp.model.Produto;
import com.lanchonete.mvp.repository.ProdutoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<Produto> listarDisponiveis() {
        return produtoRepository.findByDisponivelTrue();
    }

    public List<Produto> listarTodos(){
        return produtoRepository.findAll();
    }

    @Transactional
    public Produto salvar(Produto produto){
        return produtoRepository.save(produto);
    }

    @Transactional
    public void excluir(Long id){
        if(!produtoRepository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado para o ID: " + id);
        }
        produtoRepository.deleteById(id);
    }
}
