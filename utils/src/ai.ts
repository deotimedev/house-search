export type EmbeddingOptions = {
    model?: string,
    cloudflareAccountId: string,
    cloudflareApiKey: string
}

export async function createEmbedding(text: string, {
    model = "@cf/baai/bge-small-en-v1.5",
    cloudflareAccountId,
    cloudflareApiKey
}: EmbeddingOptions): Promise<number[]> {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/ai/run/${model}`, {
        method: "POST",
        headers: {Authorization: `Bearer ${cloudflareApiKey}`},
        body: JSON.stringify({text})
    })
    return (await response.json()).result.data[0] as number[]
}