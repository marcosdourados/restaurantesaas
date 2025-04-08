'use server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { headers } from 'next/headers'

// Função para verificar se está em ambiente de desenvolvimento
function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

// Aumenta o contador e registra o acesso
export async function incrementAndLog() {
  if (isDevelopment()) {
    return {
      count: 1,
      recentAccess: []
    };
  }

  const cf = await getCloudflareContext()
  const headersList = await headers()

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
      recentAccess: logs
    }
  } catch (error) {
    console.error('Erro ao incrementar contador:', error);
    return {
      count: 0,
      recentAccess: []
    };
  }
}

// Obtém as estatísticas atuais
export async function getStats() {
  if (isDevelopment()) {
    return {
      count: 10,
      recentAccess: []
    };
  }

  try {
    const cf = await getCloudflareContext()
    const { results: count } = await cf.env.DB.prepare('SELECT value FROM counters WHERE name = ?')
      .bind('page_views')
      .all()

    const { results: logs } = await cf.env.DB.prepare(
      'SELECT accessed_at FROM access_logs ORDER BY accessed_at DESC LIMIT 5'
    ).all()

    return {
      count: count[0]?.value || 0,
      recentAccess: logs
    }
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return {
      count: 0,
      recentAccess: []
    };
  }
}
