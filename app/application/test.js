function getOrganizationFromId(x509DistinguishedName){
    const parts = x509DistinguishedName.split('/');
    let orgName;
    for (const part of parts) {
        if (part.startsWith('OU=')) {
            orgName = part.split('=')[1];
            break;
        }
    }
    return orgName; 
}

console.log(getOrganizationFromId("/OU=org1/OU=client/OU=department1/CN=appUser1::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com"))