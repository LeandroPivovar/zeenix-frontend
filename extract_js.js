const fs = require('fs');
const content = fs.readFileSync('src/components/autonomo/AgenteAutonomoActive.vue', 'utf8');
const match = content.match(/<script>([\s\S]*?)<\/script>/);
if (match) {
    fs.writeFileSync('temp_check.js', match[1]);
    console.log('Script extracted to temp_check.js');
} else {
    console.log('No script tag found');
}
