
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { joltcab } from "@/lib/joltcab-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, Clock, User, Eye, ArrowLeft, Share2, 
  Facebook, Twitter, Linkedin, Link as LinkIcon,
  ThumbsUp, MessageCircle, Bookmark, Loader2,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import moment from "moment";
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const [post, setPost] = useState(null);
  const [slug, setSlug] = useState(null);
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => joltcab.entities.Category.list(),
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => joltcab.entities.Tag.list(),
  });

  const { data: allPosts = [] } = useQuery({
    queryKey: ['allPosts'],
    queryFn: () => joltcab.entities.BlogPost.filter({ status: 'published' }),
  });

  const updateViewsMutation = useMutation({
    mutationFn: ({ id, views }) => joltcab.entities.BlogPost.update(id, { views: views + 1 }),
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const slugParam = urlParams.get('slug');
    setSlug(slugParam);
    
    if (slugParam && allPosts.length > 0) {
      loadPost(slugParam);
    }
  }, [slug, allPosts]);

  const loadPost = async (postSlug) => {
    const foundPost = allPosts.find(p => p.slug === postSlug || p.id === postSlug);
    if (foundPost) {
      setPost(foundPost);
      // Increment views
      updateViewsMutation.mutate({ id: foundPost.id, views: foundPost.views || 0 });
    }
  };

  const getCategoryData = () => {
    if (!post?.category_id) return null;
    return categories.find(c => c.id === post.category_id);
  };

  const getTagsData = () => {
    if (!post?.tags || !Array.isArray(post.tags)) return [];
    return post.tags.map(tagId => tags.find(t => t.id === tagId)).filter(Boolean);
  };

  const getRelatedPosts = () => {
    if (!post) return [];
    return allPosts
      .filter(p => p.id !== post.id && p.category_id === post.category_id)
      .slice(0, 3);
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
    return Math.ceil(words / wordsPerMinute);
  };

  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
      </div>
    );
  }

  const category = getCategoryData();
  const postTags = getTagsData();
  const relatedPosts = getRelatedPosts();
  const readTime = calculateReadTime(post.content);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Header with back button - SIN HEADER DUPLICADO */}
      <div className="bg-white shadow-sm sticky top-20 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => window.location.href = createPageUrl('Blog')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Blog
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      {post.featured_image && (
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Title overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              {category && (
                <Badge 
                  className="mb-4 text-white text-sm"
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon} {category.name}
                </Badge>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Post Meta */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-[#15B46A] text-white">
                        {post.author_email?.charAt(0).toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{post.author_email}</p>
                      <p className="text-xs text-gray-500">Author</p>
                    </div>
                  </div>

                  <Separator orientation="vertical" className="h-10" />

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#15B46A]" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {moment(post.created_date).format('MMM DD, YYYY')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {moment(post.created_date).format('h:mm A')}
                      </p>
                    </div>
                  </div>

                  <Separator orientation="vertical" className="h-10" />

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#15B46A]" />
                    <div>
                      <p className="font-semibold text-gray-900">{readTime} min</p>
                      <p className="text-xs text-gray-500">lectura</p>
                    </div>
                  </div>

                  <Separator orientation="vertical" className="h-10" />

                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#15B46A]" />
                    <div>
                      <p className="font-semibold text-gray-900">{post.views || 0}</p>
                      <p className="text-xs text-gray-500">vistas</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {postTags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {postTags.map(tag => (
                      <Badge 
                        key={tag.id}
                        className="text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Post Content */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                {post.excerpt && (
                  <div className="text-xl text-gray-700 font-medium mb-8 pb-8 border-b border-gray-200">
                    {post.excerpt}
                  </div>
                )}

                <div 
                  className="prose prose-lg max-w-none
                    prose-headings:text-gray-900 prose-headings:font-bold
                    prose-p:text-gray-700 prose-p:leading-relaxed
                    prose-a:text-[#15B46A] prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-ul:text-gray-700 prose-ol:text-gray-700
                    prose-li:marker:text-[#15B46A]
                    prose-img:rounded-xl prose-img:shadow-lg
                    prose-blockquote:border-l-4 prose-blockquote:border-[#15B46A] 
                    prose-blockquote:pl-6 prose-blockquote:italic
                  "
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardContent>
            </Card>

            {/* Post History/Timeline */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#15B46A]" />
                  Historial del Artículo
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Publicado</p>
                      <p className="text-sm text-gray-600">
                        {moment(post.publish_date || post.created_date).format('MMMM DD, YYYY - h:mm A')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Hace {moment(post.publish_date || post.created_date).fromNow()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Última actualización</p>
                      <p className="text-sm text-gray-600">
                        {moment(post.updated_date || post.created_date).format('MMMM DD, YYYY - h:mm A')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Hace {moment(post.updated_date || post.created_date).fromNow()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Vistas totales</p>
                      <p className="text-2xl font-bold text-purple-600">{post.views || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Personas han leído este artículo
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Buttons */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#15B46A]" />
                  Compartir este artículo
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => shareOnSocial('facebook')}
                  >
                    <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => shareOnSocial('twitter')}
                  >
                    <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => shareOnSocial('linkedin')}
                  >
                    <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    onClick={copyLink}
                    className={copied ? 'bg-green-50 border-green-500' : ''}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    {copied ? 'Copiado!' : 'Copiar enlace'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Author Card */}
            <Card className="border-0 shadow-lg sticky top-24">
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarFallback className="bg-[#15B46A] text-white text-2xl">
                      {post.author_email?.charAt(0).toUpperCase() || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-gray-900 mb-1">
                    {post.author_email}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Autor del artículo</p>
                  <Button variant="outline" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Ver perfil
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Artículos relacionados</h3>
                  <div className="space-y-4">
                    {relatedPosts.map(relatedPost => (
                      <a
                        key={relatedPost.id}
                        href={`${createPageUrl('BlogPost')}?slug=${relatedPost.slug || relatedPost.id}`}
                        className="block group"
                      >
                        <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          {relatedPost.featured_image && (
                            <img
                              src={relatedPost.featured_image}
                              alt={relatedPost.title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-[#15B46A] transition-colors">
                              {relatedPost.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {moment(relatedPost.created_date).format('MMM DD, YYYY')}
                            </p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-[#15B46A] to-[#0F9456] text-white">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Estadísticas</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-3xl font-bold">{post.views || 0}</p>
                    <p className="text-white/80 text-sm">Vistas totales</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{readTime}</p>
                    <p className="text-white/80 text-sm">Minutos de lectura</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{postTags.length}</p>
                    <p className="text-white/80 text-sm">Tags</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
