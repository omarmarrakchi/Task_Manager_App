-- ============================================================
-- DevOps Task Manager - Seed Data
-- ============================================================

-- Users seed
INSERT INTO users_db.users (id, username, email, full_name, role) VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'jdupont',    'jean.dupont@devops-lab.com',    'Jean Dupont',    'MANAGER'),
    ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'amartinez',  'alice.martinez@devops-lab.com', 'Alice Martinez', 'LEAD'),
    ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'tlefevre',   'thomas.lefevre@devops-lab.com', 'Thomas Lefèvre', 'DEVELOPER'),
    ('d4e5f6a7-b8c9-0123-defa-234567890123', 'snguyen',    'sarah.nguyen@devops-lab.com',   'Sarah Nguyen',   'DEVELOPER'),
    ('e5f6a7b8-c9d0-1234-efab-345678901234', 'mbouchard',  'marc.bouchard@devops-lab.com',  'Marc Bouchard',  'INTERN')
ON CONFLICT DO NOTHING;

-- Tasks seed
INSERT INTO tasks_db.tasks (id, title, description, status, priority, assigned_to) VALUES
    ('f1e2d3c4-b5a6-7890-abcd-ef1234567890',
     'Setup Kubernetes cluster',
     'Déployer un cluster K8s sur les VMs du lab avec kubeadm. Configurer les nœuds master et worker.',
     'DONE', 'CRITICAL', 'Alice Martinez'),

    ('f2e3d4c5-b6a7-8901-bcde-f12345678901',
     'Configure Prometheus & Grafana',
     'Installer le stack de monitoring : Prometheus pour les métriques, Grafana pour les dashboards.',
     'IN_PROGRESS', 'HIGH', 'Thomas Lefèvre'),

    ('f3e4d5c6-b7a8-9012-cdef-123456789012',
     'Write Helm charts for microservices',
     'Créer les Helm charts pour les 3 microservices (frontend, task-service, user-service).',
     'IN_PROGRESS', 'HIGH', 'Alice Martinez'),

    ('f4e5d6c7-b8a9-0123-defa-234567890123',
     'Implement liveness & readiness probes',
     'Ajouter les health check endpoints dans chaque service et configurer les probes K8s.',
     'DONE', 'HIGH', 'Thomas Lefèvre'),

    ('f5e6d7c8-b9a0-1234-efab-345678901234',
     'Configure Horizontal Pod Autoscaler',
     'Mettre en place le HPA pour scaler automatiquement les services sous charge.',
     'TODO', 'MEDIUM', 'Sarah Nguyen'),

    ('f6e7d8c9-b0a1-2345-fabc-456789012345',
     'Setup CI/CD pipeline with GitLab',
     'Créer le pipeline CI/CD : build Docker images, tests, push vers le registry, déploiement automatique.',
     'IN_PROGRESS', 'CRITICAL', 'Jean Dupont'),

    ('f7e8d9c0-b1a2-3456-abcd-567890123456',
     'Chaos engineering tests',
     'Utiliser Chaos Monkey pour tester la résilience : kill de pods, perte réseau, saturation CPU.',
     'TODO', 'MEDIUM', 'Marc Bouchard'),

    ('f8e9d0c1-b2a3-4567-bcde-678901234567',
     'Document rollback procedures',
     'Rédiger la procédure de rollback automatique avec les annotations K8s et les stratégies de déploiement.',
     'TODO', 'LOW', 'Marc Bouchard'),

    ('f9e0d1c2-b3a4-5678-cdef-789012345678',
     'Optimize Docker images',
     'Réduire la taille des images Docker avec multi-stage builds et images Alpine.',
     'DONE', 'MEDIUM', 'Sarah Nguyen'),

    ('f0e1d2c3-b4a5-6789-defa-890123456789',
     'Configure network policies',
     'Définir les NetworkPolicies K8s pour isoler les microservices et sécuriser les communications inter-pods.',
     'TODO', 'HIGH', 'Jean Dupont')
ON CONFLICT DO NOTHING;
