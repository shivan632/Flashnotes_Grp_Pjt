// frontend/api/dns-update.js
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Get API keys from environment variables (set in Vercel dashboard)
    const API_KEY = process.env.DNSHE_API_KEY;
    const API_SECRET = process.env.DNSHE_API_SECRET;
    const SUBDOMAIN_ID = process.env.DNSHE_SUBDOMAIN_ID;
    const RECORD_ID = process.env.DNSHE_RECORD_ID;
    const TARGET_IP = process.env.VERCEL_IP || '216.198.79.1';
    
    if (!API_KEY || !API_SECRET) {
        return res.status(500).json({ error: 'API keys not configured' });
    }
    
    try {
        const response = await fetch('https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=update', {
            method: 'POST',
            headers: {
                'X-API-Key': API_KEY,
                'X-API-Secret': API_SECRET,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subdomain_id: parseInt(SUBDOMAIN_ID),
                record_id: parseInt(RECORD_ID),
                type: 'A',
                content: TARGET_IP,
                ttl: 600
            })
        });
        
        const data = await response.json();
        
        res.status(200).json({ success: true, data });
        
    } catch (error) {
        console.error('DNS update error:', error);
        res.status(500).json({ error: error.message });
    }
}