import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isMockEnabled = !supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your-supabase-url';

export const supabase = !isMockEnabled 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : {
        storage: {
            from: (bucket: string) => ({
                upload: async (path: string, file: any) => {
                    console.log(`[MOCK STORAGE] Uploading to ${bucket}/${path}`);
                    return { data: { path }, error: null };
                },
                getPublicUrl: (path: string) => ({
                    data: { publicUrl: `https://picsum.photos/seed/${path.split('/').pop()}/800/600` }
                })
            })
        },
        isMock: true
    } as any;
