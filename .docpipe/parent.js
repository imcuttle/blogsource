const child_process = require('child_process');

async function generStr(){

  let childProcess="";

  const randomStr = await new Promise((resolve, reject) => {
    childProcess = child_process.exec("LC_CTYPE=C tr -dc A-Za-z0-9 < /dev/urandom | head -c 20");
    childProcess.stdout.on('data', (data) => {
      resolve(data.toString())
    });
  });

  console.log(process.platform)

  // childProcess.kill()

  // process.exit(0)

  childProcess.on('close', (code, signal) => {
    console.log(`子进程收到信号 ${signal} ${code}而终止`);
  });

  return randomStr;
}

generStr()