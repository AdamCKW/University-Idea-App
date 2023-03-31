import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AlertProvider } from 'src/context/alert-context';
import { useNProgress } from 'src/hooks/use-nprogress';
import { createTheme } from 'src/theme';
import { SessionProvider } from 'next-auth/react';
import { createEmotionCache } from 'src/utils/create-emotion-cache';
import 'simplebar-react/dist/simplebar.min.css';

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

const App = (props) => {
    const {
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps: { session, ...pageProps },
    } = props;

    useNProgress();

    const getLayout = Component.getLayout ?? ((page) => page);

    const theme = createTheme();

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>Compact Ideas</title>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Head>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                {/* <AuthProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <AuthConsumer>
                            {(auth) =>
                                auth.isLoading ? (
                                    <SplashScreen />
                                ) : (
                                    getLayout(<Component {...pageProps} />)
                                )
                            }
                        </AuthConsumer>
                    </ThemeProvider>
                </AuthProvider> */}

                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <SessionProvider session={session}>
                        <AlertProvider>
                            {getLayout(<Component {...pageProps} />)}
                        </AlertProvider>
                    </SessionProvider>
                </ThemeProvider>
            </LocalizationProvider>
        </CacheProvider>
    );
};

export default App;
