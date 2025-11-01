import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import joltcab from "@/lib/joltcab-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, Search, ChevronRight, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import moment from "moment";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
  const allPosts = await joltcab.entities.BlogPost.list('-created_date');
      return allPosts.filter(post => post.status === 'published');
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
  const allCategories = await joltcab.entities.Category.list();
      return allCategories.filter(c => c.type === 'blog' || c.type === 'both');
    },
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
  queryFn: () => joltcab.entities.Tag.list(),
  });

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category_id === selectedCategory;
    const matchesTag = selectedTag === "all" || (post.tags && post.tags.includes(selectedTag));
    return matchesSearch && matchesCategory && matchesTag;
  });

  const getCategoryData = (categoryId) => {
    return categories.find(c => c.id === categoryId);
  };

  const getTagsData = (tagIds) => {
    if (!tagIds || !Array.isArray(tagIds)) return [];
    return tagIds.map(tagId => tags.find(t => t.id === tagId)).filter(Boolean);
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
    return Math.ceil(words / wordsPerMinute);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    const cleanText = text.replace(/<[^>]*>/g, '');
    return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
  };

  if (postsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
      </div>
    );
  }

  // Featured post (most recent)
  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Hero Section - SIN HEADER DUPLICADO */}
      <section className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Blog JoltCab</h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Noticias, tutoriales y actualizaciones sobre transporte inteligente
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar artículos..."
                  className="pl-12 h-14 text-lg bg-white/95 backdrop-blur-sm border-0 focus:ring-2 focus:ring-white"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Categorías</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedCategory === "all"
                        ? 'bg-[#15B46A] text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    📚 Todas
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-2 ${
                        selectedCategory === category.id
                          ? 'text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                      style={{
                        backgroundColor: selectedCategory === category.id ? category.color : undefined
                      }}
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={`cursor-pointer transition-all ${
                      selectedTag === "all"
                        ? 'bg-[#15B46A] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedTag("all")}
                  >
                    Todos
                  </Badge>
                  {tags.map(tag => (
                    <Badge
                      key={tag.id}
                      className="cursor-pointer text-white transition-all hover:shadow-lg"
                      style={{ 
                        backgroundColor: selectedTag === tag.id ? tag.color : '#E5E7EB',
                        color: selectedTag === tag.id ? 'white' : '#374151'
                      }}
                      onClick={() => setSelectedTag(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-[#15B46A] to-[#0F9456] text-white">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Estadísticas</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-3xl font-bold">{posts.length}</p>
                    <p className="text-white/80 text-sm">Artículos publicados</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{categories.length}</p>
                    <p className="text-white/80 text-sm">Categorías</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{tags.length}</p>
                    <p className="text-white/80 text-sm">Tags</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {filteredPosts.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-16 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No se encontraron artículos</h3>
                  <p className="text-gray-600 mb-6">
                    Intenta con otros términos de búsqueda o filtros
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setSelectedTag("all");
                    }}
                    className="bg-[#15B46A] hover:bg-[#0F9456]"
                  >
                    Limpiar filtros
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Featured Post */}
                {featuredPost && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Card className="border-0 shadow-2xl overflow-hidden group cursor-pointer hover:shadow-3xl transition-all">
                      <a href={`${createPageUrl('BlogPost')}?slug=${featuredPost.slug || featuredPost.id}`}>
                        <div className="grid md:grid-cols-2 gap-0">
                          <div className="relative h-64 md:h-auto">
                            {featuredPost.featured_image ? (
                              <img
                                src={featuredPost.featured_image}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#15B46A] to-[#0F9456] flex items-center justify-center text-white text-6xl">
                                📝
                              </div>
                            )}
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-red-500 text-white font-semibold">
                                ⭐ Destacado
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-8 flex flex-col justify-center">
                            {getCategoryData(featuredPost.category_id) && (
                              <Badge 
                                className="w-fit mb-3 text-white"
                                style={{ backgroundColor: getCategoryData(featuredPost.category_id).color }}
                              >
                                {getCategoryData(featuredPost.category_id).icon} {getCategoryData(featuredPost.category_id).name}
                              </Badge>
                            )}
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#15B46A] transition-colors">
                              {featuredPost.title}
                            </h2>
                            <p className="text-gray-600 mb-6 line-clamp-3">
                              {truncateText(featuredPost.excerpt || featuredPost.content, 200)}
                            </p>
                            <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {moment(featuredPost.created_date).format('DD MMM YYYY')}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {calculateReadTime(featuredPost.content)} min
                              </div>
                            </div>
                            {getTagsData(featuredPost.tags).length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {getTagsData(featuredPost.tags).slice(0, 3).map(tag => (
                                  <Badge 
                                    key={tag.id}
                                    className="text-white text-xs"
                                    style={{ backgroundColor: tag.color }}
                                  >
                                    {tag.name}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center text-[#15B46A] font-semibold group-hover:gap-3 gap-2 transition-all">
                              Leer más <ArrowRight className="w-4 h-4" />
                            </div>
                          </CardContent>
                        </div>
                      </a>
                    </Card>
                  </motion.div>
                )}

                {/* Other Posts Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {otherPosts.map((post, index) => {
                    const category = getCategoryData(post.category_id);
                    const postTags = getTagsData(post.tags);

                    return (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <Card className="border-0 shadow-lg overflow-hidden group cursor-pointer hover:shadow-2xl transition-all h-full">
                          <a href={`${createPageUrl('BlogPost')}?slug=${post.slug || post.id}`} className="block h-full">
                            <div className="relative h-48">
                              {post.featured_image ? (
                                <img
                                  src={post.featured_image}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-5xl">
                                  📝
                                </div>
                              )}
                              {category && (
                                <div className="absolute top-3 left-3">
                                  <Badge 
                                    className="text-white text-xs"
                                    style={{ backgroundColor: category.color }}
                                  >
                                    {category.icon} {category.name}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <CardContent className="p-6 flex flex-col flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#15B46A] transition-colors line-clamp-2">
                                {post.title}
                              </h3>
                              <p className="text-gray-600 mb-4 line-clamp-2 flex-1">
                                {truncateText(post.excerpt || post.content, 120)}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {moment(post.created_date).format('DD MMM')}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  {calculateReadTime(post.content)} min
                                </div>
                              </div>
                              {postTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {postTags.slice(0, 2).map(tag => (
                                    <Badge 
                                      key={tag.id}
                                      className="text-white text-xs"
                                      style={{ backgroundColor: tag.color }}
                                    >
                                      {tag.name}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center text-[#15B46A] font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
                                Leer más <ChevronRight className="w-4 h-4" />
                              </div>
                            </CardContent>
                          </a>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}