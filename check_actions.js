const https = require('https');
https.get('https://api.github.com/repos/Ciyei0/Nia_CRM/actions/runs', { headers: { "User-Agent": "NodeJS" } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const json = JSON.parse(data);
        console.log(json.workflow_runs.slice(0, 3).map(r => ({
            id: r.id,
            message: r.head_commit.message,
            status: r.status,
            conclusion: r.conclusion,
            date: r.created_at
        })));
    });
});
