import React from 'react';
import { Helmet } from 'react-helmet-async';
const AddSeo = ({ title = 'Delhi Transport Stack', description = 'Delhi Transport Stack', keywords='' }) => {
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        url: window.location.href,
        description: description,
    }
    return (
        <Helmet>
            { /* Standard metadata tags */}
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
            <link rel="canonical" href={window.location.href} />
            <link rel="alternate" href={window.location.href} hreflang="en-IN" />
            <script type="application/ld+json" data-schema="true">
                {JSON.stringify(schemaData)}
            </script>
        </Helmet>
    )
}

export default AddSeo