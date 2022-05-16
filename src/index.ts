import { getInput, setFailed, setOutput } from '@actions/core';

const configFile: string = getInput('file');
const secrets: object = JSON.parse(getInput('secrets'));

function replaceFile(string: string, variables: object) {
    return string.replace(/\{{([^}]*)}}/gm, (_, name) => variables[name]);
}

function main() {
    const fileParsed: string = replaceFile(configFile, secrets);
    setOutput('fileParsed', fileParsed);
}

try {
    main()
} catch (error) {
    setFailed(error);
}