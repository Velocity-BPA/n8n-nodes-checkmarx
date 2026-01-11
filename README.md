# n8n-nodes-checkmarx

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for **Checkmarx One**, the unified application security testing platform. This node enables workflow automation for SAST (Static Application Security Testing), SCA (Software Composition Analysis), KICS (Infrastructure as Code scanning), and API Security through Checkmarx One's REST API.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)

## Features

- **12 Resource Categories** with 80+ operations for comprehensive Checkmarx One integration
- **Multi-Region Support**: US, US2, EU, EU2, DEU, ANZ, and India regions
- **OAuth2 Authentication**: Secure token-based authentication with automatic refresh
- **Full CRUD Operations**: Create, read, update, and delete for all resources
- **Trigger Node**: Polling-based triggers for scan events
- **Binary Data Handling**: Report downloads and source code uploads
- **Comprehensive Error Handling**: Detailed error messages with retry logic

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings > Community Nodes**
3. Select **Install**
4. Enter `n8n-nodes-checkmarx` and click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the node
npm install n8n-nodes-checkmarx

# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-checkmarx.git
cd n8n-nodes-checkmarx

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-checkmarx

# Restart n8n
```

## Credentials Setup

To use this node, you'll need Checkmarx One API credentials:

1. Log in to your Checkmarx One instance
2. Navigate to **Settings > API Keys**
3. Create a new API key and save the refresh token

| Parameter | Description | Required |
|-----------|-------------|----------|
| API Key | Refresh token from Checkmarx One | Yes |
| Tenant Name | Your Checkmarx tenant name | Yes |
| Region | API region (US, US2, EU, EU2, DEU, ANZ, India) | Yes |
| IAM URL | Custom IAM URL for dedicated instances | No |

## Resources & Operations

### Projects
Manage security testing projects in Checkmarx One.

| Operation | Description |
|-----------|-------------|
| Get All | List all projects |
| Get | Get project by ID |
| Create | Create new project |
| Update | Update project settings |
| Delete | Delete a project |
| Get Tags | Get project tags |
| Add Tag | Add tag to project |
| Remove Tag | Remove tag from project |
| Get Branches | Get project branches |
| Get Last Scan | Get most recent scan |

### Applications
Manage application groupings and rules.

| Operation | Description |
|-----------|-------------|
| Get All | List all applications |
| Get | Get application by ID |
| Create | Create new application |
| Update | Update application |
| Delete | Delete application |
| Get Projects | Get projects in application |
| Add Project | Add project to application |
| Remove Project | Remove project from application |
| Get Rules | Get application rules |

### Scans
Execute and manage security scans.

| Operation | Description |
|-----------|-------------|
| Get All | List all scans |
| Get | Get scan by ID |
| Create | Run new scan |
| Cancel | Cancel running scan |
| Delete | Delete scan |
| Get Status | Get scan status |
| Get Workflow | Get scan workflow steps |
| Get Logs | Get scan logs |
| Get Summary | Get results summary |

### Results
Access and manage scan findings.

| Operation | Description |
|-----------|-------------|
| Get All | Get all results |
| Get | Get result by ID |
| Get By Scan | Get results for specific scan |
| Get By Project | Get results across project scans |
| Get SAST Results | Get SAST-specific results |
| Get SCA Results | Get SCA-specific results |
| Get KICS Results | Get KICS-specific results |
| Update State | Update result state |
| Add Comment | Add comment to result |

### Groups
Manage organizational groupings.

| Operation | Description |
|-----------|-------------|
| Get All | List all groups |
| Get | Get group by ID |
| Create | Create new group |
| Update | Update group |
| Delete | Delete group |
| Get Projects | Get projects in group |
| Get Applications | Get applications in group |

### Queries (Rules)
Access security query/rule definitions.

| Operation | Description |
|-----------|-------------|
| Get All | List all queries |
| Get | Get query by ID |
| Get By Language | Get queries for a language |
| Get SAST Queries | Get SAST queries |
| Get KICS Queries | Get KICS queries |
| Get Custom Queries | Get custom queries |
| Get Presets | Get query presets |

### Reports
Generate and download security reports.

| Operation | Description |
|-----------|-------------|
| Create | Generate new report |
| Get | Get report by ID |
| Get Status | Check generation status |
| Download | Download generated report |
| Get Available Templates | List report templates |

### Presets
Manage scan configuration presets.

| Operation | Description |
|-----------|-------------|
| Get All | List all presets |
| Get | Get preset by ID |
| Create | Create custom preset |
| Update | Update preset |
| Delete | Delete preset |
| Clone | Clone existing preset |
| Get Queries | Get queries in preset |

### Audit Trail
Access audit and activity logs.

| Operation | Description |
|-----------|-------------|
| Get All | List audit events |
| Get By Date Range | Get events in date range |
| Get By User | Get events by user |
| Get By Action | Get events by action type |

### Uploads
Upload source code for scanning.

| Operation | Description |
|-----------|-------------|
| Generate Link | Generate upload link |
| Upload Source | Upload source code zip |
| Get Upload Status | Check upload status |

### Predicates (State Management)
Bulk state management for findings.

| Operation | Description |
|-----------|-------------|
| Get All | Get all predicates |
| Create | Create new predicate |
| Update | Update predicate |
| Delete | Delete predicate |
| Apply Bulk | Apply state changes in bulk |

### Configuration
Manage project and engine configurations.

| Operation | Description |
|-----------|-------------|
| Get Project Config | Get project configuration |
| Update Project Config | Update project configuration |
| Get SAST Config | Get SAST engine configuration |
| Get SCA Config | Get SCA engine configuration |
| Get KICS Config | Get KICS engine configuration |
| Get Engine Configs | Get all engine configurations |

## Trigger Node

The **Checkmarx Trigger** node polls for scan events:

| Event | Description |
|-------|-------------|
| Scan Completed | Triggers when a scan finishes successfully |
| Scan Failed | Triggers when a scan fails |
| High Severity Found | Triggers when high severity results are found |
| New Vulnerability | Triggers when new vulnerabilities are detected |
| Result State Changed | Triggers when a result state changes |
| Any Scan Event | Triggers on any scan status change |

### Trigger Options

- **Project Filter**: Filter events by specific project
- **Severity Filter**: Filter by severity levels (Critical, High, Medium, Low, Info)
- **Engine Filter**: Filter by scan engine (SAST, SCA, KICS, API Security)
- **Include Results Summary**: Include results summary in output
- **Include Scan Details**: Include full scan details in output

## Usage Examples

### Run a SAST Scan

```javascript
// Configure the Checkmarx node
{
  "resource": "scan",
  "operation": "create",
  "projectId": "your-project-uuid",
  "branch": "main",
  "engines": ["sast"],
  "presetName": "Checkmarx Default"
}
```

### Get High Severity Results

```javascript
// Configure the Checkmarx node
{
  "resource": "result",
  "operation": "getByScan",
  "scanId": "your-scan-uuid",
  "severity": ["HIGH", "CRITICAL"],
  "status": "NEW"
}
```

### Generate Security Report

```javascript
// Configure the Checkmarx node
{
  "resource": "report",
  "operation": "create",
  "scanId": "your-scan-uuid",
  "templateId": "ScanReport",
  "format": "pdf"
}
```

### Update Result State

```javascript
// Configure the Checkmarx node
{
  "resource": "result",
  "operation": "updateState",
  "resultId": "your-result-uuid",
  "state": "CONFIRMED",
  "comment": "Verified by security team"
}
```

## Checkmarx One Concepts

### Scan Engines

- **SAST**: Static Application Security Testing - analyzes source code
- **SCA**: Software Composition Analysis - analyzes open source dependencies
- **KICS**: Keeping Infrastructure as Code Secure - analyzes IaC configurations
- **API Security**: Analyzes API definitions and endpoints

### Result States

| State | Description |
|-------|-------------|
| TO_VERIFY | Awaiting review |
| NOT_EXPLOITABLE | Confirmed false positive |
| PROPOSED_NOT_EXPLOITABLE | Suggested false positive |
| CONFIRMED | Confirmed vulnerability |
| URGENT | High priority issue |

### Result Statuses

| Status | Description |
|--------|-------------|
| NEW | First occurrence |
| RECURRENT | Seen in previous scans |
| FIXED | No longer detected |

### Severity Levels

| Level | Description |
|-------|-------------|
| CRITICAL | Critical security risk |
| HIGH | High security risk |
| MEDIUM | Medium security risk |
| LOW | Low security risk |
| INFO | Informational finding |

## Regions

| Region | API URL |
|--------|---------|
| US | https://ast.checkmarx.net |
| US2 | https://us.ast.checkmarx.net |
| EU | https://eu.ast.checkmarx.net |
| EU2 | https://eu-2.ast.checkmarx.net |
| DEU | https://deu.ast.checkmarx.net |
| ANZ | https://anz.ast.checkmarx.net |
| India | https://ind.ast.checkmarx.net |

## Error Handling

The node handles common Checkmarx API errors:

| Error Code | Description | Action |
|------------|-------------|--------|
| 400 | Bad Request | Check parameters |
| 401 | Unauthorized | Token expired, auto-refresh |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource conflict |
| 429 | Too Many Requests | Rate limited, retry with backoff |
| 500 | Server Error | Retry or contact support |

## Security Best Practices

1. **Store credentials securely**: Use n8n's credential management
2. **Use least privilege**: Grant only necessary API permissions
3. **Rotate API keys**: Regularly rotate Checkmarx API keys
4. **Monitor audit trail**: Review audit logs for suspicious activity
5. **Secure workflows**: Protect workflow exports containing credentials

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Support

- **Documentation**: [Checkmarx One API Docs](https://checkmarx.com/resource/documents/en/34965-68610-checkmarx-one-api-reference-guide.html)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-checkmarx/issues)
- **Email**: support@velobpa.com

## Acknowledgments

- [Checkmarx](https://checkmarx.com) for the application security platform
- [n8n](https://n8n.io) for the workflow automation platform
- The open-source community for continuous inspiration
