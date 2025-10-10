import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Eye, User } from 'lucide-react';

interface ArticleCategory {
    id: number;
    name: string;
    slug: string;
    color: string;
}

interface Author {
    id: number;
    name: string;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    featured_image_url: string;
    published_at: string;
    views_count: number;
    reading_time: string;
    category: ArticleCategory | null;
    author: Author;
}

interface RelatedArticle {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image_url: string;
    published_at: string;
    author: Author;
}

interface Props {
    article: Article;
    relatedArticles: RelatedArticle[];
}

export default function ArticleShow({ article, relatedArticles }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head title={article.title}>
                <meta name="description" content={article.excerpt || ''} />
            </Head>

            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="border-b bg-card">
                    <div className="container mx-auto px-4 py-6">
                        <Button
                            variant="ghost"
                            onClick={() => router.visit('/articles')}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Artikel
                        </Button>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="mx-auto max-w-4xl">
                        {/* Article Header */}
                        <div className="mb-8">
                            {article.category && (
                                <Badge
                                    className="mb-4"
                                    style={{
                                        backgroundColor: article.category.color,
                                    }}
                                >
                                    {article.category.name}
                                </Badge>
                            )}

                            <h1 className="mb-4 text-4xl font-bold tracking-tight">
                                {article.title}
                            </h1>

                            {article.excerpt && (
                                <p className="mb-6 text-lg text-muted-foreground">
                                    {article.excerpt}
                                </p>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">
                                        {article.author.name}
                                    </span>
                                </div>
                                <Separator
                                    orientation="vertical"
                                    className="h-4"
                                />
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {formatDate(article.published_at)}
                                    </span>
                                </div>
                                <Separator
                                    orientation="vertical"
                                    className="h-4"
                                />
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{article.reading_time}</span>
                                </div>
                                <Separator
                                    orientation="vertical"
                                    className="h-4"
                                />
                                <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    <span>{article.views_count} views</span>
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        {article.featured_image_url && (
                            <div className="mb-8 overflow-hidden rounded-lg">
                                <img
                                    src={article.featured_image_url}
                                    alt={article.title}
                                    className="h-auto w-full object-cover"
                                />
                            </div>
                        )}

                        {/* Article Content */}
                        <Card className="mb-12">
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none p-8">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: article.content,
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* Related Articles */}
                        {relatedArticles.length > 0 && (
                            <div>
                                <h2 className="mb-6 text-2xl font-bold">
                                    Artikel Terkait
                                </h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {relatedArticles.map((relatedArticle) => (
                                        <Card
                                            key={relatedArticle.id}
                                            className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
                                            onClick={() =>
                                                router.visit(
                                                    `/articles/${relatedArticle.slug}`,
                                                )
                                            }
                                        >
                                            {relatedArticle.featured_image_url && (
                                                <div className="relative aspect-video overflow-hidden bg-muted">
                                                    <img
                                                        src={
                                                            relatedArticle.featured_image_url
                                                        }
                                                        alt={
                                                            relatedArticle.title
                                                        }
                                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                    />
                                                </div>
                                            )}
                                            <CardContent className="p-6">
                                                <h3 className="mb-2 line-clamp-2 text-lg font-semibold group-hover:text-primary">
                                                    {relatedArticle.title}
                                                </h3>
                                                {relatedArticle.excerpt && (
                                                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                                                        {relatedArticle.excerpt}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <User className="h-3.5 w-3.5" />
                                                    <span>
                                                        {
                                                            relatedArticle
                                                                .author.name
                                                        }
                                                    </span>
                                                    <Separator
                                                        orientation="vertical"
                                                        className="h-3"
                                                    />
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>
                                                        {formatDate(
                                                            relatedArticle.published_at,
                                                        )}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
