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

## Segurança verificável e evidências

A segurança deste projeto é tratada como processo contínuo, **não como promessa de software invulnerável**:

- [Registro de riscos e superfície de ataque](docs/SECURITY_RISK_REGISTER.md)
- [Plano reproduzível de testes](docs/SECURITY_VALIDATION_PLAN.md)
- [Guia de implantação segura](docs/SECURE_DEPLOYMENT.md)
- [Resposta a incidentes e recuperação](docs/INCIDENT_PLAYBOOK.md)
- [Evidências e estudo de caso para portfólio](docs/PORTFOLIO_EVIDENCE.md)

O workflow `.github/workflows/security-guard.yml` detecta classes de credenciais expostas em arquivos rastreados e executa testes regressivos do detector. **Não substitui SAST, DAST, pentest, proteção de branch, autenticação, revisão humana nem varredura completa do histórico Git.** Verifique o status do CI na revisão que pretende publicar. Use somente dados sintéticos em demonstrações públicas.
