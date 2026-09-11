# Auth

Laboratório técnico de autenticação moderna criado para explorar, comparar e demonstrar diferentes estratégias de identidade e acesso em uma única aplicação.

O projeto reúne múltiplos fluxos de autenticação com foco em segurança, experiência do usuário e arquitetura extensível, servindo como ambiente prático para estudo de IAM, MFA e mecanismos passwordless.

## Métodos demonstrados

A implementação organiza diferentes mecanismos de autenticação em módulos independentes, incluindo password, passphrase, PIN, TOTP, OTP por e-mail e SMS, magic link, push authentication, QR login, recovery codes, social OAuth, security keys, passkeys e MFA adaptativo.

Essa abordagem permite observar diferenças de segurança, usabilidade e contexto entre métodos tradicionais, multifator e passwordless.

## Stack e execução

- **TypeScript** com arquitetura modular
- **Node.js 24+**
- Build com `tsc`
- Ambiente de desenvolvimento com `tsx`
- Testes automatizados via Node Test Runner
- Suporte a execução containerizada por Docker

```bash
npm install
npm run dev
```

Para validar o projeto:

```bash
npm test
```

## Objetivo técnico

Mais do que uma tela de login, este repositório funciona como um laboratório de engenharia de identidade: concentra diferentes fatores e fluxos em uma base comum para facilitar experimentação, comparação de abordagens e evolução de controles de autenticação.
