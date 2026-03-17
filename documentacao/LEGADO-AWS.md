# Infraestrutura AWS — Legado

> Esta infraestrutura foi **desativada** devido ao esgotamento dos créditos AWS. O projeto hoje roda localmente ou via Docker.

---

## O que existia

| Componente | Serviço | Detalhe |
|------------|---------|---------|
| Frontend | S3 + CloudFront | PWA estático em `cumes-brasil-front`, CDN `cumesbrasil.com.br` |
| Backend | EC2 (Docker + PM2) | Node.js em container, `api.cumesbrasil.com.br` |
| Banco | PostgreSQL em Docker | Mesmo container EC2 |
| Imagens | S3 + CloudFront | Bucket `cumes-brasil-images`, CDN de assets |
| Deploy | GitHub Actions + CodeDeploy | Push na `main` → deploy automático |
| SSL | Let's Encrypt + Nginx | Reverse proxy na EC2 |

## Pipeline de CI/CD que existia

- **Backend:** push em `main` (changes em `backend/`) → GitHub Actions → zip → S3 → CodeDeploy → EC2
- **Frontend:** push em `NEVERSAYNEVER` → build → sync S3 → invalidar CloudFront

## Retomar no futuro

Se for reativar a infra AWS, os arquivos relevantes ainda estão no repositório:
- `.github/workflows/` — workflows do GitHub Actions
- `appspec.yml` — configuração do CodeDeploy
- `scripts/stop_services.sh` e `start_services.sh` — scripts de deploy na EC2

Para nova configuração, criar conta/créditos AWS e reconfigurar:
1. EC2 (t2.micro ou t3.micro), S3 buckets, CloudFront distributions
2. IAM roles: `GitHubActionsCodeDeployRole` (para Actions) e `ec2_codedeploy` (para EC2)
3. Secrets do GitHub: `AWS_ACCOUNT_ID`, credenciais, IDs dos recursos
4. Nginx + SSL com Certbot na EC2
