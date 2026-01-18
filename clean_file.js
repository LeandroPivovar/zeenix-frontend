const fs = require('fs');
const path = 'src/components/autonomo/AgenteAutonomoActive.vue';

try {
    let content = fs.readFileSync(path, 'utf8');

    // Remove BOM se existir
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
        console.log('Removed BOM');
    }

    // Remove caracteres de controle (exceto \n, \r, \t)
    // \x00-\x08 matches null, bell, backspace, etc
    // \x0B matches vertical tab
    // \x0C matches form feed
    // \x0E-\x1F matches shift out/in etc
    // \x7F matches delete
    const originalLength = content.length;
    // eslint-disable-next-line no-control-regex
    content = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Substitui Non-breaking spaces (\u00A0) por espaço normal
    content = content.replace(/\u00A0/g, ' ');

    if (content.length !== originalLength) {
        console.log(`Cleaned ${originalLength - content.length} control characters`);
    } else {
        console.log('No control characters found');
    }

    fs.writeFileSync(path, content, 'utf8');
    console.log('File saved successfully');

} catch (err) {
    console.error('Error processing file:', err);
    process.exit(1);
}
