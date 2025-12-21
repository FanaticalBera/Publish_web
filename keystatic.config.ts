import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
    storage: {
        kind: 'local',
    },
    collections: {
        books: collection({
            label: 'Books',
            slugField: 'title',
            path: 'content/books/*',
            format: { contentField: 'description' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                coverImage: fields.image({
                    label: 'Cover Image',
                    directory: 'public/images/books',
                    publicPath: '/images/books',
                }),
                authors: fields.array(
                    fields.relationship({
                        label: 'Authors',
                        collection: 'authors',
                    }),
                    { label: 'Authors', itemLabel: props => props.value || 'Select Author' }
                ),
                translator: fields.text({ label: 'Translator' }),
                originalTitle: fields.text({ label: 'Original Title' }),
                format: fields.multiselect({
                    label: 'Format',
                    options: [
                        { label: 'Paperback (종이책)', value: 'paper' },
                        { label: 'E-book (전자책)', value: 'ebook' },
                    ],
                    defaultValue: ['paper'],
                }),
                categories: fields.array(
                    fields.text({ label: 'Category' }),
                    { label: 'Categories' }
                ),
                series: fields.object({
                    name: fields.text({ label: 'Series Name' }),
                    volume: fields.text({ label: 'Volume (e.g. 1, 2, or External)' }),
                }, { label: 'Series Info' }),
                publishDate: fields.date({ label: 'Publish Date' }),
                isbn: fields.text({ label: 'ISBN' }),
                previewLink: fields.url({ label: 'Preview Link (PDF/Viewer)' }),
                buyLinks: fields.array(
                    fields.object({
                        storeName: fields.select({
                            label: 'Store Name',
                            options: [
                                { label: 'Kyobo', value: 'kyobo' },
                                { label: 'Yes24', value: 'yes24' },
                                { label: 'Aladin', value: 'aladin' },
                                { label: 'Ridi', value: 'ridi' },
                                { label: 'Other', value: 'other' },
                            ],
                            defaultValue: 'kyobo',
                        }),
                        url: fields.url({ label: 'Link URL' }),
                    }),
                    { label: 'Purchase Links', itemLabel: props => `${props.fields.storeName.value}: ${props.fields.url.value}` }
                ),
                summary: fields.text({
                    label: 'Book Summary (Short)',
                    multiline: true,
                    description: 'Brief summary shown at the top of book detail page (2-3 sentences recommended)'
                }),
                description: fields.document({
                    label: 'Book Description (Full)',
                    formatting: true,
                    dividers: true,
                    links: true,
                    images: {
                        directory: 'public/images/content',
                        publicPath: '/images/content',
                    },
                }),
            },
        }),

        authors: collection({
            label: 'Authors',
            slugField: 'name',
            path: 'content/authors/*',
            format: { contentField: 'bio' },
            schema: {
                name: fields.slug({ name: { label: 'Name' } }),
                photo: fields.image({
                    label: 'Profile Photo',
                    directory: 'public/images/authors',
                    publicPath: '/images/authors',
                }),
                shortBio: fields.text({
                    label: 'Short Bio',
                    multiline: true,
                    description: 'Brief bio shown at the top of author detail page (1-2 sentences recommended)'
                }),
                links: fields.array(
                    fields.url({ label: 'Link URL' }),
                    { label: 'Social/Web Links' }
                ),
                bio: fields.document({
                    label: 'Biography',
                    formatting: true,
                    links: true,
                }),
            },
        }),

        news: collection({
            label: 'News & Posts',
            slugField: 'title',
            path: 'content/news/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                type: fields.select({
                    label: 'Type',
                    options: [
                        { label: 'Notice (공지)', value: 'notice' },
                        { label: 'New Release (신간)', value: 'release' },
                        { label: 'Event (이벤트)', value: 'event' },
                        { label: 'Column (칼럼)', value: 'column' },
                    ],
                    defaultValue: 'notice',
                }),
                publishedAt: fields.date({ label: 'Published Date' }),
                excerpt: fields.text({ label: 'Excerpt', multiline: true }),
                coverImage: fields.image({
                    label: 'Cover Image',
                    directory: 'public/images/news',
                    publicPath: '/images/news',
                }),
                relatedBooks: fields.array(
                    fields.relationship({
                        label: 'Related Book',
                        collection: 'books'
                    }),
                    { label: 'Related Books' }
                ),
                content: fields.document({
                    label: 'Content',
                    formatting: true,
                    dividers: true,
                    links: true,
                    images: {
                        directory: 'public/images/content',
                        publicPath: '/images/content',
                    },
                }),
            },
        }),

        dataroom: collection({
            label: 'Data Room',
            slugField: 'title',
            path: 'content/dataroom/*',
            format: { contentField: 'description' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                description: fields.document({
                    label: 'Description',
                    formatting: true,
                    links: true,
                }),
                coverImage: fields.image({
                    label: 'Cover Image',
                    directory: 'public/images/dataroom',
                    publicPath: '/images/dataroom',
                }),
                file: fields.file({
                    label: 'File Attachment',
                    directory: 'public/files/dataroom',
                    publicPath: '/files/dataroom',
                }),
                publishedAt: fields.date({ label: 'Published Date' }),
            },
        }),
    },

    singletons: {
        settings: singleton({
            label: 'Global Settings',
            path: 'content/settings',
            schema: {
                siteName: fields.text({ label: 'Site Name' }),
                favicon: fields.image({
                    label: 'Favicon',
                    directory: 'public',
                    publicPath: '/',
                }),
                defaultSeo: fields.object({
                    title: fields.text({ label: 'Default Meta Title' }),
                    description: fields.text({ label: 'Default Meta Description' }),
                    image: fields.image({
                        label: 'Default OG Image',
                        directory: 'public/images',
                        publicPath: '/images',
                    }),
                }, { label: 'Default SEO' }),
                analyticsId: fields.text({ label: 'GA4 Measurement ID' }),
            },
        }),

        homepage: singleton({
            label: 'Homepage',
            path: 'content/homepage',
            schema: {
                heroSection: fields.object({
                    headline: fields.text({ label: 'Headline' }),
                    subheadline: fields.text({ label: 'Sub-headline' }),
                    ctaButton: fields.checkbox({ label: 'Show CTA Button' }),
                    image: fields.image({
                        label: 'Hero Image',
                        directory: 'public/images/hero',
                        publicPath: '/images/hero'
                    }),
                }, { label: 'Hero Section' }),
                globalAnnouncement: fields.object({
                    enabled: fields.checkbox({ label: 'Enable Announcement Bar' }),
                    message: fields.text({ label: 'Message' }),
                    link: fields.url({ label: 'Link URL' }),
                }, { label: 'Global Announcement' }),
            },
        }),

        about: singleton({
            label: 'About Page',
            path: 'content/about',
            schema: {
                mission: fields.document({
                    label: 'Mission Statement (아침을 여는 시작)',
                    formatting: true,
                    links: true,
                }),
                history: fields.document({
                    label: 'History (새로운 꿈을 꾸다)',
                    formatting: true,
                    links: true,
                }),
                journey: fields.document({
                    label: 'Journey (함께하는 여정)',
                    formatting: true,
                    links: true,
                }),
            },
        }),

        contact: singleton({
            label: 'Contact Page',
            path: 'content/contact',
            schema: {
                email: fields.text({ label: 'Contact Email' }),
                phone: fields.text({ label: 'Contact Phone' }),
                address: fields.text({ label: 'Contact Address', multiline: true }),
                snsLinks: fields.array(
                    fields.object({
                        platform: fields.text({ label: 'Platform (e.g. Instagram)' }),
                        url: fields.url({ label: 'URL' }),
                    }),
                    { label: 'SNS Links', itemLabel: props => props.fields.platform.value }
                )
            }
        }),

        legal: singleton({
            label: 'Legal Pages',
            path: 'content/legal',
            schema: {
                privacyPolicy: fields.document({ label: 'Privacy Policy', formatting: true })
            }
        })
    },
});
