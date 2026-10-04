# Auth

Projeto de estudo sobre **IAM, MFA e autenticação passwordless** feito em TypeScript.

Em vez de tratar login como uma única tela, este repositório compara diferentes formas de autenticação e os riscos de cada uma: senha, TOTP, OTP, passkeys, security keys, magic links, recovery codes e outros fluxos.

## Métodos estudados

- password e passphrase
- PIN
- TOTP
- OTP por e-mail e SMS
- magic link
- push authentication
- QR login
- recovery codes
- OAuth
- security keys
- passkeys
- MFA adaptativo

## Stack

- TypeScript
- Node.js 24+
- `tsx` para desenvolvimento
- Node Test Runner
- Docker

## Rodando localmente

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm start
```

Testes:

```bash
npm test
```

## Estrutura

- `src/` — aplicação e fluxos de autenticação
- `public/` — interface
- `test/` — testes automatizados
- `docs/` — documentação de IAM e segurança
- `SECURITY.md` — política de segurança do repositório

## Observação

Este projeto é de estudo. Autenticação de produção exige controles adicionais de armazenamento de credenciais, gestão de sessão, recuperação de conta, proteção contra abuso, auditoria e integração segura com provedores de identidade.
