export type EmbeddingOptions = {
    model?: string,
    cloudflareAccountId: string,
    cloudflareApiKey: string
}

export async function createEmbedding<T extends string | string[]>(text: T, {
    model = "@cf/baai/bge-small-en-v1.5",
    cloudflareAccountId,
    cloudflareApiKey
}: EmbeddingOptions) {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/ai/run/${model}`, {
        method: "POST",
        headers: {Authorization: `Bearer ${cloudflareApiKey}`},
        body: JSON.stringify({text})
    })
    const json = await response.json()
    if (json.success === false) throw Error(json.errors[0].message)
    const data = (json).result.data as number[][]
    return (Array.isArray(text) ? data : data[0]) as T extends string[] ? number[][] : number[]
}