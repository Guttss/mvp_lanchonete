# 🍔 Lanchonete MVP - Cardápio Digital e Painel de Gestão

Um sistema *Full-Stack* completo desenvolvido para lanchonetes e restaurantes. Oferece uma interface móvel fluida para os clientes realizarem pedidos e um painel de controle seguro para os administradores gerirem a fila de preparo, o cardápio e o faturamento diário.

## 🚀 Funcionalidades

### 📱 Visão do Cliente (Mobile-First)

* **Cardápio Interativo:** Navegação por categorias (Salgados, Bebidas, etc.).

* **Carrinho de Compras:** Adição/remoção de itens com cálculo de total em tempo real.

* **Checkout Inteligente:** Coleta do nome e horário de retirada (com limite de horário).

* **Feedback Visual:** Modal de sucesso personalizado após o envio do pedido.

### 💻 Visão do Administrador (Dashboard)

* **Autenticação Segura:** Proteção por palavra-passe encriptada com **BCrypt**.

* **Gestão de Pedidos:** Fila de preparo em tempo real, opção de concluir ou cancelar pedidos (pedidos cancelados não entram no faturamento).

* **Gestão de Cardápio (CRUD):** Adicionar novos produtos, editar preços, excluir ou marcar como "Esgotado/Disponível".

* **Métricas Diárias:** Cálculo automático de vendas do dia e quantidade de pedidos pendentes.

## 🛠️ Tecnologias Utilizadas

**Front-end:**

* [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)

* [Tailwind CSS](https://tailwindcss.com/) (Estilização)

* [Lucide React](https://lucide.dev/) (Ícones)

**Back-end:**

* [Java](https://www.java.com/) + [Spring Boot](https://spring.io/projects/spring-boot)

* [PostgreSQL](https://www.postgresql.org/) (Banco de Dados Relacional) rodando em **Docker**

* [jBCrypt](https://www.mindrot.org/projects/jBCrypt/) (Criptografia de Senhas)

## ⚙️ Como executar o projeto na sua máquina

Por questões de segurança, os ficheiros que contêm credenciais e endereços de IP não são enviados para o GitHub. Siga os passos abaixo para configurar o ambiente local.

### Pré-requisitos

* Node.js (v18 ou superior)

* Java JDK (17 ou superior)

* **Docker e Docker Compose** (para o banco de dados)

### 1. Clonar o Repositório

```bash
git clone https://github.com/SEU_USUARIO/lanchonete-mvp.git
cd lanchonete-mvp
```

### 2. Subir o Banco de Dados (Docker)

Na raiz do projeto, onde se encontra o ficheiro `docker-compose.yml`, inicie o container do PostgreSQL em segundo plano:

```bash
docker-compose up -d
```
*O Docker irá baixar a imagem do Postgres e criar a base de dados automaticamente.*

### 3. Configurar e Rodar o Back-end

1. Navegue até à pasta do back-end: `cd backend`

2. O ficheiro de configuração foi ignorado pelo Git. Crie um novo ficheiro em `src/main/resources/application.properties` com as credenciais que combinam com o seu `docker-compose.yml`:

```properties
# Configuração do PostgreSQL (Valores devem bater com o docker-compose.yml)
spring.datasource.url=jdbc:postgresql://localhost:5432/lanchonete
spring.datasource.username=postgres
spring.datasource.password=SUA_SENHA_AQUI
spring.jpa.hibernate.ddl-auto=update

# Senha do Painel Admin (Hash BCrypt)
# Exemplo abaixo é o hash para a senha: admin123
lanchonete.admin.hash=$2a$10$wNq.75nB6d0N0U5.5tPjQuOQ3rYyBv1C1XhM3Q3O.z0l9fQkC1T1a
```

3. Execute o projeto Spring Boot pela sua IDE (IntelliJ, Eclipse, etc.) ou via Maven. O servidor iniciará na porta `8080`.

### 4. Configurar e Rodar o Front-end

1. Abra um novo terminal e navegue até à pasta do front-end: `cd frontend`

2. Instale as dependências do projeto:

```bash
npm install
```

3. Crie um ficheiro chamado `.env` na raiz da pasta `frontend` e aponte para a API local (ou para o seu IP da rede Wi-Fi, caso queira testar pelo telemóvel):

```env
# Para rodar apenas no PC:
VITE_API_URL=http://localhost:8080/api

# Para testar no celular (substitua pelo IP IPv4 do seu PC):
# VITE_API_URL=http://192.168.0.X:8080/api
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

### 5. Acesso ao Sistema

* **Cardápio do Cliente:** `http://localhost:5173/`

* **Painel Admin:** `http://localhost:5173/admin` *(Senha padrão: admin123)*

---
