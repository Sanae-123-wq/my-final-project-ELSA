import fetch from 'node-fetch'; // wait, I don't have node-fetch
// Built-in fetch is available in Node 18+

async function runTest() {
    console.log("--- STARTING TEST FLOW ---");
    try {
        // 1. Log in as Vendor
        console.log("1. Logging in as vendor...");
        const vendorLogin = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'momo@gmail.com', password: 'password123' }) // assuming password123, maybe fail? let's hardcode testing by creating a test vendor and delivery inside DB directly via MongoDB script instead
        });
        console.log("Login status:", vendorLogin.status);
    } catch (e) {
        console.error(e);
    }
}
runTest();
