# Auth — notas do projeto

## Finalidade

Comparar diferentes mecanismos de autenticação dentro da mesma aplicação e entender onde cada um melhora ou piora a segurança.

## Assuntos cobertos

- senha e passphrase;
- TOTP;
- OTP;
- magic link;
- push;
- recovery codes;
- OAuth;
- security keys;
- passkeys;
- MFA adaptativo.

## Stack

TypeScript, Node.js e Docker.

## Foco técnico

O interesse principal está no ciclo completo de identidade: autenticação, segundo fator, sessão, recuperação e fallback. Um método forte perde valor quando o fluxo de recuperação é fraco, por isso os mecanismos são analisados como parte do mesmo sistema.
