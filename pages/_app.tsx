import "@/styles/app.scss";
import { CssVarsProvider, extendTheme } from "@mui/joy";
import type { AppProps } from 'next/app';
import Head from 'next/head';

// Use the <Provider> to improve performance and allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

    const customTheme = extendTheme({
        fontFamily: {
            display: 'Noto Sans', // applies to `h1`–`h4`
            body: 'Noto Sans', // applies to `title-*` and `body-*`
        },
        typography: {
            "body-lg": {
                fontWeight: 200
            },
            "body-md": {
                fontWeight: 200
            },
            "body-sm": {
                fontWeight: 200
            },
            "body-xs": {
                fontWeight: 200
            },
            h1: {
                fontSize: "1.2em",
                fontWeight: 400
            },
            h2: {
                fontSize: "1.15em",
                fontWeight: 300
            }
        },
        components: {
            JoyButton: {
                styleOverrides: {
                    root: {
                        fontWeight: 300,
                        borderRadius: 2
                    }
                }
            },
            JoyIconButton:{
                styleOverrides: {
                    root: {
                        borderRadius: 2
                    }
                }
            },
            JoyInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 2
                    }
                }
            }
        }
    });

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <meta name="HandheldFriendly" content="True" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="MobileOptimized" content="320" />
            </Head>
            <CssVarsProvider
                defaultMode="system"
                // the local storage key to use.
                modeStorageKey="roon-openai-system-mode"
                // set as root provider
                disableNestedContext
                theme={customTheme}
            >
                <Component {...pageProps} />
            </CssVarsProvider>
        </>
    )
}
