export async function send(url: string, content: any) {
    const payload = JSON.stringify({ content });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: payload,
    });
    
    if (!response.ok) throw new Error(`Error: ${response.status}`);

}