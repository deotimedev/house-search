export type EmbeddingOptions = {
    model?: string,
    cloudflareAccountId: string,
    cloudflareApiKey: string
}

export async function createEmbedding<T extends string | string[]>(text: T, {
    model = "@cf/baai/bge-small-en-v1.5",
    cloudflareAccountId,
    cloudflareApiKey
}: EmbeddingOptions): Promise<T extends string[] ? number[][] : number[]> {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/ai/run/${model}`, {
        method: "POST",
        headers: {Authorization: `Bearer ${cloudflareApiKey}`},
        body: JSON.stringify({text})
    })
    const data = (await response.json()).result.data as number[][]
    return (Array.isArray(text) ? data : data[0]) as T extends string[] ? number[][] : number[]
}