import fs from 'fs';

const content = fs.readFileSync('f:/CURSOR/fincontrol/src/pages/Settings.tsx', 'utf8');

const lines = content.split('\n');
let divBalance = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    let openCount = 0;
    let match;
    const openRegex = /<div\b([^>]*)>/g;
    while ((match = openRegex.exec(line)) !== null) {
        if (!match[1].endsWith('/')) {
            openCount++;
        }
    }

    const closeCount = (line.match(/<\/div>/g) || []).length;
    divBalance += openCount - closeCount;

    if (i >= 2540 && i <= 2555) {
        console.log(`Line ${i + 1}: Balance=${divBalance} | Content: ${line}`);
    }
}
console.log('Final balance:', divBalance);
