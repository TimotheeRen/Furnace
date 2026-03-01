export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const server = searchParams.get('server')
  const cookieHeader = req.headers.get('cookie') || '';

  const host = process.env.API_HOST || "http://localhost:5678"
  const response = await fetch(`${host}/console?server=${server}`, {
    headers: {
      "Cookie": cookieHeader, 
      "Accept": 'text/event-stream',
    },
    cache: 'no-store'
  })

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform', 
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', 
    }
  }
 )
}
