import NextHead from "next/head";

export default function Head(props) {
    const { title } = props;
    return <NextHead>
        <title>{title ? `${title} - Sentry` : "Sentry"}</title>
    </NextHead>;
}