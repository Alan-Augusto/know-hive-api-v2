# Question Response - Múltiplas Tentativas e Alternativas

## Problema Resolvido

O modelo anterior não permitia:
1. **Múltiplas tentativas de resposta** para a mesma pergunta
2. **Múltiplas alternativas selecionadas** em uma única resposta
3. **Diferenciação entre tentativas** e controle de qual é a resposta final

## Solução Implementada

### 1. Mudanças no Schema

#### Nova estrutura da tabela `QuestionResponse`:
- `attempt_number`: Número da tentativa (1, 2, 3...)
- `is_final`: Indica se esta é a resposta final do usuário
- Remoção do campo `alternative_id` direto

#### Nova tabela `ResponseAlternative`:
- Relaciona uma resposta com múltiplas alternativas
- Permite que uma resposta tenha várias alternativas selecionadas

### 2. Mudanças no DTO

#### `CreateQuestionResponseDto`:
```typescript
{
  "question_id": "uuid",
  "user_id": "uuid", 
  "alternative_ids": ["uuid1", "uuid2"], // Array de IDs
  "collection_id": "uuid", // opcional
  "response_time": 30, // opcional
  "attempt_number": 1, // opcional - calculado automaticamente
  "is_final": true // opcional - marca como resposta final
}
```

### 3. Exemplos de Uso

#### Questão Verdadeiro/Falso - Primeira Tentativa:
```json
POST /question-responses
{
  "question_id": "q-123",
  "user_id": "u-456", 
  "alternative_ids": ["alt-verdadeiro"], 
  "attempt_number": 1,
  "is_final": false
}
```

#### Questão Verdadeiro/Falso - Segunda Tentativa (Final):
```json
POST /question-responses
{
  "question_id": "q-123",
  "user_id": "u-456",
  "alternative_ids": ["alt-falso"],
  "attempt_number": 2, 
  "is_final": true
}
```

#### Questão Múltipla Escolha com Múltiplas Respostas Corretas:
```json
POST /question-responses
{
  "question_id": "q-789",
  "user_id": "u-456",
  "alternative_ids": ["alt-a", "alt-c", "alt-d"],
  "is_final": true
}
```

### 4. Novos Endpoints

#### Buscar tentativas de um usuário para uma questão:
```
GET /question-responses/attempts/{userId}/{questionId}?collectionId=optional
```

#### Buscar resposta final de um usuário para uma questão:
```
GET /question-responses/final/{userId}/{questionId}?collectionId=optional
```

### 5. Validações Implementadas

1. **Tipo de Questão**: Questões "Verdadeiro ou Falso" só permitem uma alternativa
2. **Alternativas Válidas**: Todas as alternativas devem pertencer à questão
3. **Numeração de Tentativas**: Calculada automaticamente se não fornecida
4. **Resposta Final**: Quando marcada como final, desmarca outras respostas finais anteriores

### 6. Cálculo de Correção

A resposta é considerada correta quando:
- **Todas** as alternativas selecionadas são corretas
- **Pelo menos uma** alternativa foi selecionada

### 7. Migração do Banco

A migração foi aplicada automaticamente:
- Nome: `20250624112152_add_multiple_responses_and_attempts`
- Criou a nova tabela `ResponseAlternative`
- Adicionou campos `attempt_number` e `is_final` à tabela `QuestionResponse`
- Removeu o campo `alternative_id` da tabela `QuestionResponse`

### 8. Vantagens da Nova Estrutura

1. ✅ **Múltiplas tentativas**: Usuário pode responder várias vezes
2. ✅ **Controle de tentativas**: Sistema sabe qual é a tentativa atual
3. ✅ **Resposta final**: Permite marcar qual resposta vale para avaliação
4. ✅ **Múltiplas alternativas**: Suporta questões com várias respostas corretas
5. ✅ **Flexibilidade**: Funciona com qualquer tipo de questão
6. ✅ **Estatísticas avançadas**: Pode analisar evolução do usuário através das tentativas
7. ✅ **Compatibilidade**: Mantém a API existente funcionando

### 9. Casos de Uso Suportados

- **Quiz simples**: Uma tentativa, resposta final
- **Prática com múltiplas tentativas**: Usuário pode tentar até acertar
- **Questões complexas**: Múltiplas alternativas corretas
- **Análise de aprendizado**: Acompanhar evolução através das tentativas
- **Sistemas adaptativos**: Diferentes comportamentos baseados no número de tentativas
