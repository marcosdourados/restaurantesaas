'use server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { headers } from 'next/headers'

// Função para garantir que as tabelas existam
async function ensureTablesExist() {
  const cf = await getCloudflareContext()
  
  try {
    // Criação da tabela de contadores se não existir
    await cf.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS counters (
        name TEXT PRIMARY KEY,
        value INTEGER NOT NULL DEFAULT 0
      )
    `).run()
    
    // Criação da tabela de logs de acesso se não existir
    await cf.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS access_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT NOT NULL,
        path TEXT NOT NULL,
        accessed_at DATETIME NOT NULL
      )
    `).run()
    
    // Inserir valor inicial no contador se não existir
    await cf.env.DB.prepare(`
      INSERT OR IGNORE INTO counters (name, value) VALUES ('page_views', 0)
    `).run()
    
    return true
  } catch (error) {
    console.error('Erro ao criar tabelas:', error)
    return false
  }
}

// Aumentar contador e registrar acesso
export async function incrementAndLog() {
  const cf = await getCloudflareContext()
  const headersList = headers()
  
  // Garantir que as tabelas existam
  await ensureTablesExist()

  try {
    const { results: countResults } = await cf.env.DB.prepare(
      'INSERT INTO counters (name, value) VALUES (?, 1) ON CONFLICT (name) DO UPDATE SET value = value + 1 RETURNING value'
    )
      .bind('page_views')
      .all()

    await cf.env.DB.prepare('INSERT INTO access_logs (ip, path, accessed_at) VALUES (?, ?, datetime())')
      .bind(
        headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown',
        headersList.get('x-forwarded-host') || '/'
      )
      .run()

    const { results: logs } = await cf.env.DB.prepare('SELECT * FROM access_logs ORDER BY accessed_at DESC LIMIT 5').all()

    return {
      count: countResults[0]?.value || 0,
      recentAccess: logs || []
    } as { count: number; recentAccess: { accessed_at: string }[] }
  } catch (error) {
    console.error('Erro ao incrementar contador:', error)
    return {
      count: 0,
      recentAccess: []
    }
  }
}

// Obter estatísticas atuais
export async function getStats() {
  const cf = await getCloudflareContext()
  
  // Garantir que as tabelas existam
  await ensureTablesExist()
  
  try {
    const { results: count } = await cf.env.DB.prepare('SELECT value FROM counters WHERE name = ?')
      .bind('page_views')
      .all()

    const { results: logs } = await cf.env.DB.prepare(
      'SELECT accessed_at FROM access_logs ORDER BY accessed_at DESC LIMIT 5'
    ).all()

    return {
      count: count[0]?.value || 0,
      recentAccess: logs || []
    } as { count: number; recentAccess: { accessed_at: string }[] }
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    return {
      count: 0,
      recentAccess: []
    }
  }
}
