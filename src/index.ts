import { getInput, setFailed, setOutput, setSecret} from '@actions/core';

const configFile: string = getInput('file');
const endpoint: string = getInput('endpoint');
const vaultToken: string = getInput('vaultToken');
const vaultPath: string = getInput('vaultPath');
const namespace: string = getInput('namespace');
const secretVersion: string = getInput('secretVersion');

const options = {
    apiVersion: 'v1',
    endpoint: endpoint,
    token: vaultToken,
    namespace: namespace
};

function replaceFile(string: string, variables: object): string {
    return string.replace(/\{{([^}]*)}}/gm, (_, name) => variables[name]);
}

async function getSecrets() {
    const vault = require("node-vault")(options);
    if (secretVersion) {
        return vault.read(vaultPath + "?version=" + secretVersion);
    }
    else {
        return vault.read(vaultPath)
     }
}

async function main() {
    const secrets: object = (await getSecrets())?.data?.data;
    const fileParsed: string = replaceFile(configFile, secrets);
    setOutput('fileParsed', fileParsed);
    setSecret('prueba');
    setSecret(fileParsed);
}

try {
    main()
} catch (error) {
    setFailed(error);
}