## Master 2 - Services Web

### 📋 Description

Développer un service de monitoring basé sur un système CRON qui vérifie périodiquement la disponibilité d'un service web (URL/IP). Le service doit obligatoirement inclure un système d'alertes via webhook (Discord ou Ntfy) pour notifier des changements d'état.

### 🎯 Objectifs Principaux

1. Implémenter un système CRON de monitoring
2. Mettre en place des alertes en temps réel
3. Collecter et visualiser les métriques
4. Stocker l'historique des 24 dernières heures

### 🛠️ Spécifications Techniques

### Backend (Node.js)

- **Système CRON** :
  - Utilisation de node-cron ou similar
  - Intervalle configurable (secondes/minutes)
  - Gestion robuste des erreurs
- **Collecte des Métriques** :
  - Status (up/down)
  - Temps de réponse
  - Timestamp
  - Changements d'état
- **Système d'Alertes (Obligatoire)** :
  - Integration webhook Discord ou Ntfy
  - Alertes lors des changements d'état (up -> down, down -> up)
  - Alertes sur les temps de réponse anormaux
- **Stockage** :
  - Format JSON
  - Rétention de 24 heures
  - Rotation des logs

### Frontend (React)

- Dashboard de monitoring :
  - Graphique temps réel
  - Statut actuel
  - Historique des alertes
  - Configuration du CRON

### 📚 Technologies Requises

- **Backend** :
  - Node.js
  - node-cron
  - webhook-discord ou ntfy
  - Express
- **Frontend** :
  - React
  - Recharts
  - Tailwind CSS

### 🚨 Système d'Alertes (Détails)

Le système d'alertes doit notifier :

1. Changement d'état (obligatoire)
   - Service down -> Alerte immédiate
   - Service up -> Notification de récupération
   - Template d'alerte Discord/Ntfy fourni
2. Performance (obligatoire)
   - Temps de réponse > seuil défini
   - Erreurs répétées
   - Statistiques journalières

### 📝 Livrables

1. Code source (GitHub)
2. Documentation :
   - Configuration CRON
   - Setup Webhooks
   - API endpoints
3. Présentation (10min)

### 🌟 Critères d'Évaluation

- **Fonctionnalités Core (50%)** :
  - CRON fonctionnel (20%)
  - Système d'alertes (20%)
  - Collecte des métriques (10%)
- **Technique (30%)** :
  - Qualité du code
  - Gestion des erreurs
  - Performance
- **Interface (20%)** :
  - Dashboard
  - Configuration
  - Visualisation

### 💡 Fonctionnalités Bonus

- Support multi-services
- Alertes personnalisables
- Métriques additionnelles
- Tests automatisés

### 🚀 Pour Commencer

```bash
# Installation
npm init
npm install node-cron webhook-discord express

# Structure du projet
monitoring-service/
├── cron/
│   └── monitor.js    # Service CRON
├── alerts/
│   └── webhook.js    # Gestion des alertes
├── storage/
│   └── metrics.json  # Stockage des données
└── frontend/
    └── src/
        └── App.js    # Interface

```

### 📊 Exemple de Métrique

```json
{
  "timestamp": "2024-02-05T14:30:00Z",
  "status": "up",
  "responseTime": 123,
  "url": "<https://api.example.com>",
  "alerts": [
    {
      "type": "status_change",
      "from": "down",
      "to": "up",
      "timestamp": "2024-02-05T14:30:00Z"
    }
  ]
}
```

### 🚨 Exemple d'Alerte Discord

```jsx
const webhook = new Webhook("WEBHOOK_URL");

webhook.send({
  embeds: [
    {
      title: "🔴 Service Down",
      description: "Le service api.example.com est injoignable",
      color: 0xff0000,
      fields: [
        { name: "URL", value: "<https://api.example.com>" },
        { name: "Timestamp", value: new Date().toISOString() },
      ],
    },
  ],
});
```

### 📝 Système de Logs

Le projet doit implémenter un système de logs structurés en JSON en utilisant Winston.

### Configuration requise des logs

- **Format** : JSON obligatoire
- **Rétention** : 7 jours de logs
- **Niveaux de logs requis** :
  - `info`: Checks de statut normaux
  - `warn`: Alertes et dépassements de seuils
  - `error`: Erreurs de service et problèmes techniques

### Types de logs à implémenter

1. **Logs de status** :

```json
json
Copy
{
  "level": "info",
  "message": "Service status check",
  "timestamp": "2024-02-05T15:30:00.000Z",
  "metadata": {
    "url": "https://api.example.com",
    "status": 200,
    "responseTime": 123,
    "type": "status_check"
  }
}

```

1. **Logs d'alerte** :

```json
json
Copy
{
  "level": "warn",
  "message": "Alert triggered",
  "timestamp": "2024-02-05T15:30:00.000Z",
  "metadata": {
    "url": "https://api.example.com",
    "type": "alert",
    "alertType": "high_latency",
    "details": {
      "responseTime": 5234,
      "threshold": 5000
    }
  }
}

```

1. **Logs d'erreur** :

```json
json
Copy
{
  "level": "error",
  "message": "Service error",
  "timestamp": "2024-02-05T15:30:00.000Z",
  "metadata": {
    "url": "https://api.example.com",
    "error": "Connection timeout",
    "type": "error"
  }
}

```

### Structure des fichiers de logs

```
Copy
logs/
├── error.json    # Logs de niveau error uniquement
├── combined.json # Tous les logs
└── alerts.json   # Logs d'alertes uniquement

```

### Utilisation des logs

Les logs doivent être utilisés pour :

1. Tracking des statuts de service
2. Historique des alertes
3. Debugging et résolution de problèmes
4. Analyses de performance
5. Génération de rapports

### Visualisation des logs

L'interface doit inclure une section permettant de :

- Filtrer les logs par niveau
- Rechercher dans les logs
- Exporter les logs
- Visualiser les tendances

### 📅 Planning

1. **Semaine 1** : CRON et Alertes
2. **Semaine 2** : Frontend
3. **Semaine 3** : Finitions

### 💬 Questions Fréquentes

**Q: Comment gérer les faux positifs ?**
R: Implémenter un système de retry avant d'envoyer une alerte.

**Q: Quelle fréquence de CRON ?**
R: Minimum 30 secondes entre chaque check.

### 📚 Ressources

- [node-cron documentation](https://github.com/node-cron/node-cron)
- [Discord Webhook Guide](https://discord.com/developers/docs/resources/webhook)
- [Ntfy Documentation](https://docs.ntfy.sh/)

### 🤝 Support

Questions : [EMAIL]
Sessions : [HORAIRES]

---

_Bon développement ! 🚀_
