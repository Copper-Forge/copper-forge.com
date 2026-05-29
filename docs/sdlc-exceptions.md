# SDLC Exceptions

This repository follows Copper Forge SDLC standards defined in `cf-ops-company/standards/sdlc_standards.md` unless explicitly overridden here.

## Approved Exception: Hosting and Deployment Target

- Repository: `cf-app-marketing-site`
- Scope: Marketing website (`copper-forge.com`)
- Exception: This project is hosted on Netlify as a frontend/static-site deployment target.
- Basis: `cf-ops-company/standards/tech_stack.md` lists Netlify as an approved platform for "Web hosting (frontend / static sites)".

## Impact of This Exception

The following AWS/Terraform deployment expectations in the SDLC are treated as not applicable for this repo while this exception remains in effect:

- `deploy-dev.yml` and `deploy-prod.yml` AWS account promotion workflows
- AWS OIDC role-assumption deployment path for runtime hosting
- Terraform environment structure for app runtime hosting (`iac/environments/dev`, `iac/environments/prod`)

This exception does not waive baseline SDLC controls for code quality and review. Branching rules, PR review requirements, CI validation gates, and secrets scanning remain required.
