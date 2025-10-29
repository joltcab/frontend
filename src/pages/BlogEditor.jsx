import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Eye, ArrowLeft, Upload, X } from "lucide-react";
import { createPageUrl } from "@/utils";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function BlogEditor() {
  const [user, setUser] = useState(null);
  const [postId, setPostId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image: "",
    category_id: "",
    tags: [],
    status: "draft",
    publish_date: "",
    allow_comments: true,
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.filter({ type: 'blog' }),
  });

  const { data: allTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => base44.entities.Tag.list(),
  });

  useEffect(() => {
    loadUser();
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setPostId(id);
      loadPost(id);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      if (!postId) {
        setFormData(prev => ({ ...prev, author_email: userData.email }));
      }
    } catch (error) {
      console.error("Not authenticated");
      window.location.href = createPageUrl("Home");
    }
  };

  const loadPost = async (id) => {
    try {
      const posts = await base44.entities.BlogPost.list();
      const post = posts.find(p => p.id === id);
      if (post) {
        setFormData(post);
      }
    } catch (error) {
      console.error("Error loading post:", error);
    }
  };

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.BlogPost.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      window.location.href = createPageUrl(`BlogPost?slug=${data.slug}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.BlogPost.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      alert("Post updated successfully!");
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, featured_image: file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const generateSlug = (title) => {
    return title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      seo_title: prev.seo_title || title,
    }));
  };

  const handleSave = async (status = formData.status) => {
    if (!formData.title || !formData.content) {
      alert("Title and content are required");
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        status,
        slug: formData.slug || generateSlug(formData.title),
        author_email: user.email,
      };

      if (postId) {
        await updateMutation.mutateAsync({ id: postId, data: dataToSave });
      } else {
        await createMutation.mutateAsync(dataToSave);
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => window.location.href = createPageUrl("AdminPanel")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {postId ? 'Edit Post' : 'Create New Post'}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {formData.status === 'published' ? 'Published' : 'Draft'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleSave('draft')}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Draft
            </Button>
            <Button
              className="bg-[#15B46A] hover:bg-[#0F9456]"
              onClick={() => handleSave('published')}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
              Publish
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter post title..."
                    className="text-2xl font-bold h-auto py-4"
                  />
                </div>

                {/* Slug */}
                <div>
                  <Label>URL Slug</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-friendly-slug"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {window.location.origin}/blog/{formData.slug || 'your-post-slug'}
                  </p>
                </div>

                {/* Content Editor */}
                <div>
                  <Label>Content *</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                      modules={quillModules}
                      className="min-h-[400px]"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <Label>Excerpt</Label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief summary of your post..."
                    className="w-full px-3 py-2 border rounded-lg resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>SEO Title</Label>
                  <Input
                    value={formData.seo_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                    placeholder="SEO optimized title"
                  />
                </div>
                <div>
                  <Label>Meta Description</Label>
                  <textarea
                    value={formData.seo_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                    placeholder="Brief description for search engines..."
                    className="w-full px-3 py-2 border rounded-lg resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.seo_description?.length || 0}/160 characters</p>
                </div>
                <div>
                  <Label>Keywords</Label>
                  <Input
                    value={formData.seo_keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.featured_image ? (
                  <div className="relative">
                    <img
                      src={formData.featured_image}
                      alt="Featured"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-4">Upload featured image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="featured-image"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => document.getElementById('featured-image').click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Choose Image'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {allTags.map(tag => (
                    <Badge
                      key={tag.id}
                      className="cursor-pointer"
                      style={{
                        backgroundColor: formData.tags?.includes(tag.id) ? tag.color : '#E5E7EB',
                        color: formData.tags?.includes(tag.id) ? '#fff' : '#374151'
                      }}
                      onClick={() => {
                        const tags = formData.tags || [];
                        if (tags.includes(tag.id)) {
                          setFormData(prev => ({ ...prev, tags: tags.filter(t => t !== tag.id) }));
                        } else {
                          setFormData(prev => ({ ...prev, tags: [...tags, tag.id] }));
                        }
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.status === 'scheduled' && (
                  <div>
                    <Label>Publish Date</Label>
                    <Input
                      type="datetime-local"
                      value={formData.publish_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, publish_date: e.target.value }))}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label>Allow Comments</Label>
                  <Switch
                    checked={formData.allow_comments}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allow_comments: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}