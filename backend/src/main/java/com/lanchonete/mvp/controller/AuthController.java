package com.lanchonete.mvp.controller;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    // O Spring vai no application.properties, pega o hash e injeta nesta variável.
    // O código Java fica limpo e não contém nenhuma senha escrita!
    @Value("${lanchonete.admin.hash}")
    private String hashSalvoNoSistema;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> payload) {
        String senhaDigitada = payload.get("senha");

        try {
            // A mágica do BCrypt: ele pega a senha digitada e
            // verifica matematicamente se ela corresponde ao hash complexo salvo.
            boolean senhaCorreta = BCrypt.checkpw(senhaDigitada, hashSalvoNoSistema);

            if (senhaCorreta) {
                return ResponseEntity.ok("Autorizado");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro interno na validação");
        }

        // Se chegar aqui, a senha estava errada
        return ResponseEntity.status(401).body("Senha incorreta");
    }
}