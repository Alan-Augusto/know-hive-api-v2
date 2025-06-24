# Question Response API Documentation

Esta documentação descreve a API para gerenciar respostas às questões no sistema Know Hive.

## Visão Geral

O módulo `question-response` permite registrar e gerenciar respostas dos usuários às questões, seja de forma individual ou no contexto de uma coleção. O sistema registra qual alternativa foi escolhida, o tempo gasto para responder e calcula automaticamente se a resposta está correta baseado na alternativa selecionada.

## Endpoints

### 1. Criar Resposta
**POST** `/question-responses`

Registra uma nova resposta de um usuário a uma questão.

**Body:**
```json
{
  "question_id": "uuid-da-questao",
  "user_id": "uuid-do-usuario", 
  "alternative_id": "uuid-da-alternativa",
  "response_time": 30,
  "collection_id": "uuid-da-colecao" // opcional
}
```

**Validações:**
- ✅ Verifica se a questão existe
- ✅ Verifica se o usuário existe
- ✅ Verifica se a alternativa existe e pertence à questão
- ✅ Verifica se a coleção existe (quando fornecida)

**Resposta:**
```json
{
  "id": "uuid-da-resposta",
  "question_id": "uuid-da-questao",
  "user_id": "uuid-do-usuario",
  "alternative_id": "uuid-da-alternativa",
  "collection_id": "uuid-da-colecao",
  "response_time": 30,
  "answered_at": "2025-06-23T19:30:00.000Z",
  "is_correct": true,
  "question": {
    "id": "uuid-da-questao",
    "statement": "Qual é a capital do Brasil?",
    "title": "Geografia Básica"
  },
  "user": {
    "id": "uuid-do-usuario",
    "name": "João Silva",
    "email": "joao@email.com"
  },
  "alternative": {
    "id": "uuid-da-alternativa",
    "text": "Brasília",
    "is_correct": true
  },
  "collection": {
    "id": "uuid-da-colecao",
    "title": "Geografia do Brasil"
  }
}
```

### 2. Listar Respostas
**GET** `/question-responses`

Lista todas as respostas com filtros opcionais.

**Query Parameters:**
- `user_id` (opcional): Filtrar por usuário
- `question_id` (opcional): Filtrar por questão
- `collection_id` (opcional): Filtrar por coleção

**Exemplos:**
- `GET /question-responses` - Lista todas as respostas
- `GET /question-responses?user_id=uuid-do-usuario` - Lista respostas de um usuário
- `GET /question-responses?question_id=uuid-da-questao` - Lista respostas de uma questão
- `GET /question-responses?collection_id=uuid-da-colecao` - Lista respostas de uma coleção

**Resposta:**
```json
[
  {
    "id": "uuid-da-resposta",
    "question_id": "uuid-da-questao",
    "user_id": "uuid-do-usuario",
    "alternative_id": "uuid-da-alternativa",
    "collection_id": "uuid-da-colecao",
    "response_time": 30,
    "answered_at": "2025-06-23T19:30:00.000Z",
    "is_correct": true,
    "question": { ... },
    "user": { ... },
    "alternative": { ... },
    "collection": { ... }
  }
]
```

### 3. Buscar Resposta por ID
**GET** `/question-responses/:id`

Busca uma resposta específica pelo ID.

**Parâmetros:**
- `id`: UUID da resposta

**Resposta:**
```json
{
  "id": "uuid-da-resposta",
  "question_id": "uuid-da-questao",
  "user_id": "uuid-do-usuario",
  "alternative_id": "uuid-da-alternativa",
  "collection_id": "uuid-da-colecao",
  "response_time": 30,
  "answered_at": "2025-06-23T19:30:00.000Z",
  "is_correct": true,
  "question": { ... },
  "user": { ... },
  "alternative": { ... },
  "collection": { ... }
}
```

### 4. Respostas por Usuário
**GET** `/question-responses/user/:userId`

Lista todas as respostas de um usuário específico.

**Parâmetros:**
- `userId`: UUID do usuário

**Resposta:**
Array de respostas ordenadas por data (mais recentes primeiro).

### 5. Respostas por Questão
**GET** `/question-responses/question/:questionId`

Lista todas as respostas de uma questão específica.

**Parâmetros:**
- `questionId`: UUID da questão

**Resposta:**
Array de respostas ordenadas por data (mais recentes primeiro).

### 6. Respostas por Coleção
**GET** `/question-responses/collection/:collectionId`

Lista todas as respostas de uma coleção específica.

**Parâmetros:**
- `collectionId`: UUID da coleção

**Resposta:**
Array de respostas ordenadas por data (mais recentes primeiro).

### 7. Estatísticas do Usuário
**GET** `/question-responses/stats/user/:userId`

Obtém estatísticas de desempenho de um usuário.

**Query Parameters:**
- `collection_id` (opcional): Filtrar estatísticas por coleção

**Exemplo:**
- `GET /question-responses/stats/user/uuid-do-usuario`
- `GET /question-responses/stats/user/uuid-do-usuario?collection_id=uuid-da-colecao`

**Resposta:**
```json
{
  "user_id": "uuid-do-usuario",
  "collection_id": "uuid-da-colecao",
  "total_responses": 50,
  "correct_responses": 40,
  "incorrect_responses": 10,
  "accuracy_percentage": 80.0,
  "total_time_seconds": 1500,
  "average_time_seconds": 30.0
}
```

### 8. Estatísticas da Questão
**GET** `/question-responses/stats/question/:questionId`

Obtém estatísticas de uma questão específica.

**Parâmetros:**
- `questionId`: UUID da questão

**Resposta:**
```json
{
  "question_id": "uuid-da-questao",
  "total_responses": 100,
  "correct_responses": 75,
  "incorrect_responses": 25,
  "accuracy_percentage": 75.0,
  "average_time_seconds": 35.5,
  "alternative_stats": [
    {
      "alternative_id": "uuid-alternativa-1",
      "alternative_text": "Brasília",
      "is_correct": true,
      "response_count": 75
    },
    {
      "alternative_id": "uuid-alternativa-2", 
      "alternative_text": "São Paulo",
      "is_correct": false,
      "response_count": 15
    },
    {
      "alternative_id": "uuid-alternativa-3",
      "alternative_text": "Rio de Janeiro", 
      "is_correct": false,
      "response_count": 10
    }
  ]
}
```

### 9. Estatísticas da Coleção
**GET** `/question-responses/stats/collection/:collectionId`

Obtém estatísticas de uma coleção específica.

**Parâmetros:**
- `collectionId`: UUID da coleção

**Resposta:**
```json
{
  "collection_id": "uuid-da-colecao",
  "total_responses": 200,
  "correct_responses": 150,
  "incorrect_responses": 50,
  "accuracy_percentage": 75.0,
  "average_time_seconds": 32.5,
  "question_stats": [
    {
      "question_id": "uuid-questao-1",
      "question_title": "Geografia Básica",
      "question_statement": "Qual é a capital do Brasil?",
      "total_responses": 50,
      "correct_responses": 40
    },
    {
      "question_id": "uuid-questao-2",
      "question_title": "História",
      "question_statement": "Em que ano foi proclamada a independência do Brasil?",
      "total_responses": 45,
      "correct_responses": 35
    }
  ]
}
```

### 10. Atualizar Resposta
**PATCH** `/question-responses/:id`

Atualiza uma resposta existente.

**Parâmetros:**
- `id`: UUID da resposta

**Body (campos opcionais):**
```json
{
  "alternative_id": "novo-uuid-da-alternativa",
  "response_time": 25,
  "collection_id": "novo-uuid-da-colecao"
}
```

**Validações:**
- ✅ Verifica se a resposta existe
- ✅ Verifica se a nova alternativa pertence à questão original
- ✅ Verifica se a nova coleção existe (quando fornecida)

### 11. Remover Resposta
**DELETE** `/question-responses/:id`

Remove uma resposta específica.

**Parâmetros:**
- `id`: UUID da resposta

**Resposta:**
```json
{
  "message": "Resposta com ID uuid-da-resposta removida com sucesso"
}
```

## Modelos de Dados

### CreateQuestionResponseDto
```typescript
{
  question_id: string;     // UUID da questão (obrigatório)
  user_id: string;         // UUID do usuário (obrigatório)
  alternative_id: string;  // UUID da alternativa (obrigatório)
  response_time?: number;  // Tempo em segundos (opcional)
  collection_id?: string;  // UUID da coleção (opcional)
}
```

### GetResponsesQueryDto
```typescript
{
  user_id?: string;        // Filtrar por usuário
  question_id?: string;    // Filtrar por questão
  collection_id?: string;  // Filtrar por coleção
}
```

### GetUserStatsDto
```typescript
{
  collection_id?: string;  // Filtrar estatísticas por coleção
}
```

## Regras de Negócio

1. **Validação de Integridade**: Todas as relações (usuário, questão, alternativa, coleção) são validadas antes da criação/atualização.

2. **Cálculo Automático de Correção**: O campo `is_correct` é calculado automaticamente com base na alternativa selecionada, não sendo necessário informá-lo.

3. **Contexto Opcional de Coleção**: Uma resposta pode ser dada no contexto de uma coleção (quando o usuário está respondendo a um quiz/coleção) ou de forma avulsa.

4. **Ordenação Temporal**: As respostas são sempre ordenadas pela data de criação (mais recentes primeiro).

5. **Estatísticas Dinâmicas**: Todas as estatísticas são calculadas em tempo real com base nas respostas existentes.

## Códigos de Status HTTP

- **200 OK**: Operação realizada com sucesso
- **201 Created**: Resposta criada com sucesso
- **400 Bad Request**: Dados inválidos ou alternativa não pertence à questão
- **404 Not Found**: Recurso não encontrado (resposta, usuário, questão, coleção)
- **500 Internal Server Error**: Erro interno do servidor

## Casos de Uso

### 1. Resposta Individual
Usuário responde a uma questão específica fora do contexto de uma coleção:
```bash
POST /question-responses
{
  "question_id": "uuid-da-questao",
  "user_id": "uuid-do-usuario",
  "alternative_id": "uuid-da-alternativa",
  "response_time": 30
}
```

### 2. Resposta em Coleção
Usuário responde a uma questão dentro de uma coleção/quiz:
```bash
POST /question-responses
{
  "question_id": "uuid-da-questao",
  "user_id": "uuid-do-usuario", 
  "alternative_id": "uuid-da-alternativa",
  "response_time": 30,
  "collection_id": "uuid-da-colecao"
}
```

### 3. Acompanhar Progresso
Verificar progresso de um usuário em uma coleção:
```bash
GET /question-responses/stats/user/uuid-do-usuario?collection_id=uuid-da-colecao
```

### 4. Análise de Questão
Analisar performance de uma questão específica:
```bash
GET /question-responses/stats/question/uuid-da-questao
```

Esta API fornece uma base sólida para gamificação, análise de desempenho e acompanhamento de progresso dos usuários no sistema Know Hive.
