import https from 'https';

const data = JSON.stringify({
    order_status: "paid",
    Customer: {
        email: "carloshenriquedionisio@gmail.com",
        full_name: "Carlos Henrique"
    },
    commissions: {
        charge_amount: "1990"
    },
    order_id: "node_test_esm_001"
});

const options = {
    hostname: 'mukuljlqhwvzaofnlcyg.supabase.co',
    path: '/functions/v1/payment-webhook',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
