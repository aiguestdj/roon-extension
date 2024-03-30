
export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        try {
            const roon = await import('@/library/roon')
        } catch (e) {

        }
    }
}