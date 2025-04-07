-- Criação da tabela de contadores
CREATE TABLE IF NOT EXISTS counters (
  name TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);

-- Criação da tabela de logs de acesso
CREATE TABLE IF NOT EXISTS access_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  path TEXT NOT NULL,
  accessed_at DATETIME NOT NULL
);

-- Inserir valor inicial no contador de visualizações
INSERT OR IGNORE INTO counters (name, value) VALUES ('page_views', 0); 