# Auth

> **Identity & Access Security Lab** — laboratório pessoal para estudo de IAM, MFA, passwordless e fluxos modernos de autenticação.

O **Auth** reúne diferentes mecanismos de autenticação em uma única base para comparar segurança, experiência do usuário e arquitetura. O objetivo é estudar identidade e acesso de forma prática, observando quando cada fator, fluxo ou mecanismo faz sentido.

## Métodos explorados

- Password e passphrase
- PIN
- TOTP
- OTP por e-mail e SMS
- Magic link
- Push authentication
- QR login
- Recovery codes
- Social OAuth
- Security keys
- Passkeys
- MFA adaptativo

## Objetivo de estudo

O projeto funciona como um laboratório de **IAM e segurança de identidade**. A proposta é observar diferenças entre autenticação tradicional, multifator e passwordless, além de praticar conceitos relacionados a fatores de autenticação, recuperação de acesso e redução de dependência de senhas.

Não é uma solução pronta para autenticação de produção. O repositório existe para aprendizado, experimentação controlada e evolução técnica.

## Stack

- **TypeScript** com arquitetura modular
- **Node.js 24+**
- Build com `tsc`
- Ambiente de desenvolvimento com `tsx`
- Testes automatizados via Node Test Runner
- Suporte a execução containerizada com Docker

## Execução

```bash
npm install
npm run dev
```

## Validação

```bash
npm test
```

## Segurança

Em ambientes reais, mecanismos de autenticação exigem controles adicionais de proteção de credenciais, gestão de segredos, rate limiting, auditoria, recuperação segura, políticas de sessão e integração apropriada com provedores de identidade.

---

**Categoria:** Cybersecurity • IAM • MFA • Passwordless • Identity Security

**Status:** laboratório pessoal de estudo e experimentação técnica.
