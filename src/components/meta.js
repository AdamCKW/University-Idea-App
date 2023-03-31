import Head from 'next/head';

const Meta = ({ title, keyword, description }) => {
    return (
        <Head>
            <meta name="keywords" content={keyword} />
            <meta name="description" content={description} />
            <title>{title}</title>
        </Head>
    );
};

Meta.defaultProps = {
    title: 'Create Next App',
    keywords: 'Web development, Programming, NextJS',
    description: 'Get the latest version, npx create-next-app@latest',
};

export default Meta;
