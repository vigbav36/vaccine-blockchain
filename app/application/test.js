const name = "x509::/OU=org1/OU=client/OU=department1/CN=bavesh::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com"
const parts = name.split('/');
let orgName;
for (const part of parts) {
    if (part.startsWith('OU=')) {
        orgName = part.split('=')[1];
        break;
    }
}

console.log(orgName)