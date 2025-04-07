// Arquivo de configuração para testes
// Este arquivo é carregado antes de cada teste

// Configuração de variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key';
process.env.PORT = '3002';

// Silenciar logs durante testes
console.log = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();
