# Architecture

## Overview

Auth is organized as an identity-security laboratory rather than a production identity provider. The codebase separates authentication mechanisms so each factor or flow can be studied independently.

## Main layers

1. **Authentication methods**
   - Password, OTP, TOTP, passkey, security-key and passwordless concepts are represented as separate flows.

2. **Application services**
   - Shared validation and orchestration logic keeps individual methods focused.

3. **Runtime boundary**
   - Node.js executes the lab services.
   - Environment configuration is kept outside source code.

4. **Validation**
   - Automated tests cover expected and invalid behavior.
   - Docker support makes execution repeatable.

## Security model

The project demonstrates concepts, not production-grade identity issuance. Real deployments would also require hardened session management, secret rotation, rate limiting, audit trails and integration with a trusted identity provider.

## Design goal

Keep each authentication method understandable enough to compare usability, attack surface and recovery characteristics without hiding the core behavior behind unnecessary framework complexity.
