const { spawn } = require('child_process');
const WINDOWS_PLATFORM = 'win32'
const SHELL = process.platform === WINDOWS_PLATFORM

const server = spawn('node', ['records'], {
    stdio: 'ignore',
    detached: true,
    shell: SHELL
});

const karma = spawn('npm', ['run', 'karma'], {
    shell: SHELL
});

karma.stdout.on('data', (data) => {
    console.log(data.toString());
});

karma.stderr.on('data', (data) => {
    console.error(data.toString());
});

karma.on('close', (code) => {
    server.kill();
});
