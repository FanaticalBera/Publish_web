import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
    storage: {
        kind: 'local',
    },
    collections: {
        books: collection({
            label: '도서 DB',
            slugField: 'title',
            path: 'content/books/*',
            format: { contentField: 'description' },
            schema: {
                title: fields.slug({ name: { label: '도서명' } }),
                coverImage: fields.image({
                    label: '표지 이미지',
                    directory: 'public/images/books',
                    publicPath: '/images/books',
                }),
                authors: fields.array(
                    fields.relationship({
                        label: '작가',
                        collection: 'authors',
                    }),
                    { label: '작가', itemLabel: props => props.value || '작가 선택' }
                ),
                translator: fields.text({ label: '번역가' }),
                originalTitle: fields.text({ label: '책에 대한 한 문장 (적을 것이 없으면 작가 이름을 적어주세요)' }),
                format: fields.multiselect({
                    label: '판형',
                    options: [
                        { label: '종이책', value: 'paper' },
                        { label: '전자책', value: 'ebook' },
                    ],
                    defaultValue: ['paper'],
                }),
                categories: fields.array(
                    fields.text({ label: '카테고리' }),
                    { label: '카테고리' }
                ),
                series: fields.object({
                    name: fields.text({ label: '시리즈명' }),
                    volume: fields.text({ label: '권호 (예: 1, 2, 외전)' }),
                }, { label: '시리즈 정보' }),
                publishDate: fields.date({ label: '출간일' }),
                isbn: fields.text({ label: 'ISBN' }),
                previewLink: fields.url({ label: '미리보기 링크 (PDF/뷰어)' }),
                buyLinks: fields.array(
                    fields.object({
                        storeName: fields.select({
                            label: '서점명',
                            options: [
                                { label: '교보문고', value: 'kyobo' },
                                { label: 'Yes24', value: 'yes24' },
                                { label: '알라딘', value: 'aladin' },
                                { label: '리디북스', value: 'ridi' },
                                { label: '기타', value: 'other' },
                            ],
                            defaultValue: 'kyobo',
                        }),
                        url: fields.url({ label: '링크 URL' }),
                    }),
                    { label: '구매 링크', itemLabel: props => `${props.fields.storeName.value}: ${props.fields.url.value}` }
                ),
                summary: fields.text({
                    label: '도서 요약 (목록용)',
                    multiline: true,
                    description: '도서 목록이나 상단에 노출되는 짧은 요약입니다 (2-3문장 권장)'
                }),
                description: fields.document({
                    label: '도서 상세 소개',
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
            label: '작가 DB',
            slugField: 'name',
            path: 'content/authors/*',
            format: { contentField: 'bio' },
            schema: {
                name: fields.slug({ name: { label: '이름' } }),
                photo: fields.image({
                    label: '프로필 사진',
                    directory: 'public/images/authors',
                    publicPath: '/images/authors',
                }),
                shortBio: fields.text({
                    label: '약력 (요약)',
                    multiline: true,
                    description: '작가 상세 페이지 상단에 노출되는 짧은 소개입니다'
                }),
                links: fields.array(
                    fields.url({ label: '링크 URL' }),
                    { label: '웹/SNS 링크' }
                ),
                bio: fields.document({
                    label: '작가 소개 (상세)',
                    formatting: true,
                    links: true,
                }),
            },
        }),

        news: collection({
            label: '소식 & 포스트',
            slugField: 'title',
            path: 'content/news/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: '제목' } }),
                type: fields.select({
                    label: '분류',
                    options: [
                        { label: '공지', value: 'notice' },
                        { label: '신간', value: 'release' },
                        { label: '이벤트', value: 'event' },
                        { label: '칼럼', value: 'column' },
                    ],
                    defaultValue: 'notice',
                }),
                publishedAt: fields.date({ label: '게시일' }),
                excerpt: fields.text({ label: '요약문', multiline: true }),
                coverImage: fields.image({
                    label: '커버 이미지',
                    directory: 'public/images/news',
                    publicPath: '/images/news',
                }),
                relatedBooks: fields.array(
                    fields.relationship({
                        label: '관련 도서',
                        collection: 'books'
                    }),
                    { label: '관련 도서' }
                ),
                content: fields.document({
                    label: '본문',
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
            label: '자료실',
            slugField: 'title',
            path: 'content/dataroom/*',
            format: { contentField: 'description' },
            schema: {
                title: fields.slug({ name: { label: '자료명' } }),
                description: fields.document({
                    label: '설명',
                    formatting: true,
                    links: true,
                }),
                coverImage: fields.image({
                    label: '커버 이미지',
                    directory: 'public/images/dataroom',
                    publicPath: '/images/dataroom',
                }),
                file: fields.file({
                    label: '첨부 파일',
                    directory: 'public/files/dataroom',
                    publicPath: '/files/dataroom',
                }),
                publishedAt: fields.date({ label: '게시일' }),
            },
        }),

        referenceNotes: collection({
            label: '참고 노트',
            slugField: 'title',
            path: 'content/reference-notes/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: '제목' } }),
                excerpt: fields.text({ label: '요약', multiline: true }),
                coverImage: fields.image({
                    label: '썸네일 이미지',
                    directory: 'public/images/reference-notes',
                    publicPath: '/images/reference-notes',
                }),
                content: fields.document({
                    label: '내용',
                    formatting: true,
                    dividers: true,
                    links: true,
                    images: {
                        directory: 'public/images/content',
                        publicPath: '/images/content',
                    },
                }),
                publishedAt: fields.date({ label: '발행일' }),
                category: fields.select({
                    label: '카테고리',
                    options: [
                        { label: '독서 가이드', value: 'guide' },
                        { label: '연구 자료', value: 'research' },
                        { label: '교육 자료', value: 'education' },
                        { label: '기타', value: 'other' },
                    ],
                    defaultValue: 'guide'
                }),
            },
        }),
    },

    singletons: {
        settings: singleton({
            label: '전체 설정',
            path: 'content/settings',
            schema: {
                siteName: fields.text({ label: '사이트 이름' }),
                favicon: fields.image({
                    label: '파비콘',
                    directory: 'public',
                    publicPath: '/',
                }),
                defaultSeo: fields.object({
                    title: fields.text({ label: '기본 메타 제목' }),
                    description: fields.text({ label: '기본 메타 설명' }),
                    image: fields.image({
                        label: '기본 메타(OG) 이미지',
                        directory: 'public/images',
                        publicPath: '/images',
                    }),
                }, { label: '기본 SEO 설정' }),
                analyticsId: fields.text({ label: 'GA4 측정 ID' }),
            },
        }),

        homepage: singleton({
            label: '메인 페이지',
            path: 'content/homepage',
            schema: {
                heroSection: fields.object({
                    headline: fields.text({ label: '헤드라인' }),
                    subheadline: fields.text({ label: '서브 헤드라인' }),
                    ctaButton: fields.checkbox({ label: 'CTA 버튼 표시' }),
                    image: fields.image({
                        label: '히어로 이미지',
                        directory: 'public/images/hero',
                        publicPath: '/images/hero'
                    }),
                }, { label: '히어로 섹션' }),
                globalAnnouncement: fields.object({
                    enabled: fields.checkbox({ label: '공지 바 활성화' }),
                    message: fields.text({ label: '메시지' }),
                    link: fields.url({ label: '링크 URL' }),
                }, { label: '전역 공지' }),
            },
        }),

        about: singleton({
            label: '소개 페이지',
            path: 'content/about',
            schema: {
                mission: fields.document({
                    label: '미션 (아침을 여는 시작)',
                    formatting: true,
                    links: true,
                }),
                history: fields.document({
                    label: '연혁 (새로운 꿈을 꾸다)',
                    formatting: true,
                    links: true,
                }),
                journey: fields.document({
                    label: '여정 (함께하는 여정)',
                    formatting: true,
                    links: true,
                }),
            },
        }),

        contact: singleton({
            label: '문의 페이지',
            path: 'content/contact',
            schema: {
                email: fields.text({ label: '이메일' }),
                phone: fields.text({ label: '전화번호' }),
                address: fields.text({ label: '주소', multiline: true }),
                snsLinks: fields.array(
                    fields.object({
                        platform: fields.text({ label: '플랫폼 (예: Instagram)' }),
                        url: fields.url({ label: 'URL' }),
                    }),
                    { label: 'SNS 링크', itemLabel: props => props.fields.platform.value }
                )
            }
        }),

        legal: singleton({
            label: '약관 페이지',
            path: 'content/legal',
            schema: {
                privacyPolicy: fields.document({ label: '개인정보처리방침', formatting: true })
            }
        })
    },
});
