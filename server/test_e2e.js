const http = require('http');

const request = (method, path, data, token = null) => {
    return new Promise((resolve, reject) => {
        const payload = data ? JSON.stringify(data) : '';
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        };
        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch(e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(payload);
        req.end();
    });
};

async function run() {
    console.log('[1] Logging in as Vendor (sanaechef@gmail.com)');
    let res = await request('POST', '/api/auth/login', { email: 'sanaechef@gmail.com', password: 'password123' });
    if (res.status !== 200) {
        // try momo
        res = await request('POST', '/api/auth/login', { email: 'momo@gmail.com', password: 'password123' });
    }
    console.log('Vendor login:', res.status, res.data.email);
    const vendorToken = res.data.token;

    console.log('[2] Fetching Vendor Orders');
    const vOrders = await request('GET', '/api/orders/vendor-orders', null, vendorToken);
    console.log(`Found ${vOrders.data.length} vendor orders.`);
    
    if (vOrders.data.length === 0) return console.log('No orders to test with.');

    // Find a non-delivered order
    const orderToTest = vOrders.data.find(o => o.status !== 'delivered' && o.status !== 'ready');
    if (!orderToTest) return console.log('No pending/preparing orders found.');

    console.log(`[3] Updating Order ${orderToTest._id} from ${orderToTest.status} to READY`);
    const updateRes = await request('PUT', `/api/orders/${orderToTest._id}`, { status: 'ready' }, vendorToken);
    console.log('Update result status:', updateRes.status);
    console.log('Updated order status:', updateRes.data.status, 'DeliveryID:', updateRes.data.deliveryId);

    console.log('[4] Logging in as newest Delivery User');
    const uRes = await request('POST', '/api/auth/login', { email: 'mimi@gmail.com', password: 'password123' });
    console.log('Delivery login:', uRes.status, uRes.data.email);
    const deliveryToken = uRes.data.token;

    console.log('[5] Fetching My Deliveries');
    const delRes = await request('GET', '/api/orders/my-deliveries', null, deliveryToken);
    console.log(`Found ${delRes.data.length} deliveries assigned to me.`);
    console.log(delRes.data.map(o => `OrderID: ${o._id} | Status: ${o.status}`));
}
run();
