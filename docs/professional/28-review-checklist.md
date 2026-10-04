# Checklist de revisão

Antes de fechar uma mudança em autenticação:

- procurar segredo em código, teste e log;
- testar sucesso e falha;
- testar replay quando existir token ou challenge;
- conferir rate limiting;
- validar criação e revogação de sessão;
- revisar impacto em recuperação de conta;
- conferir se privilégio mudou;
- validar o evento de auditoria;
- rodar os testes;
- atualizar a documentação se o fluxo mudou.

Mudança pequena em login pode alterar a fronteira de segurança inteira.
