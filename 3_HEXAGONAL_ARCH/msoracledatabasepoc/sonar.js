const scanner = require('sonarqube-scanner').default;

function main() {

  const context = process.argv.find(arg => arg.startsWith('--SONAR_CONTEXT='));
  const value = context ? context.split('=')[1] : null;

  const sonar_options = {
    'sonar.projectVersion': '1.0',
    'sonar.language': 'ts',
    'sonar.sourceEncoding': 'UTF-8',
    'sonar.projectKey': process.env.APP_NAME,
    'sonar.sources': 'src',
    'sonar.exclusions': 'tests/**,node_modules/**,coverage/**,**/*.spec.ts,**/main.ts,**/*.module.ts,**/*.doc.ts',
    'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
    'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
  };

  if (value !== null) {

    if (value.toLowerCase() === 'local') {
      scanner(
        {
          serverUrl: 'http://localhost:9000',
          options: {
            ...sonar_options,
            'sonar.login': 'admin',
            'sonar.password': 'sonar12345',
          }
        },
        error => {
          if (error) {
            console.log('Error ejecutando sonar');
            console.error(error);
          }
          process.exit();
        }
      );
    }

    if (value.toLowerCase() === 'claro') {
      scanner(
        {
          serverUrl: 'https://sonarqube-operaciones-ocp.apps.ocpprd.claro.co',
          options: {
            ...sonar_options,
            'sonar.login': 'sonar_digital',
            'sonar.password': 'DigitalS0n4r2024*',
          }
        },
        error => {
          if (error) {
            console.log('Error ejecutando sonar');
            console.error(error);
          }
          process.exit();
        }
      );
    }
  }

}

main();