
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea"; // New import for SEO description
import { Loader2, ArrowLeft, X } from "lucide-react"; // X for removing featured image
import { createPageUrl } from "@/utils";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

// Helper for generating slug
const generateSlug = (title) => {
  return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim();
};

function PageForm({ page, authorEmail, onSuccess }) {
  const [formData, setFormData] = useState({
    title: page?.title || '',
    slug: page?.slug || '',
    content: page?.content || '',
    featured_image: page?.featured_image || '',
    template: page?.template || 'default',
    use_global_layout: page?.use_global_layout !== false, // Default true
    status: page?.status || 'draft',
    show_in_menu: page?.show_in_menu !== false,
    menu_order: page?.menu_order || 0,
    seo_title: page?.seo_title || '',
    seo_description: page?.seo_description || '',
  });
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  // Update formData when page prop changes (for edit scenarios)
  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        content: page.content || '',
        featured_image: page.featured_image || '',
        template: page.template || 'default',
        use_global_layout: page.use_global_layout !== false,
        status: page.status || 'draft',
        show_in_menu: page.show_in_menu !== false,
        menu_order: page.menu_order || 0,
        seo_title: page.seo_title || '',
        seo_description: page.seo_description || '',
      });
    } else {
      // For new pages, ensure author_email is set
      setFormData(prev => ({ ...prev, author_email: authorEmail }));
    }
  }, [page, authorEmail]);

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (page?.id) {
        return base44.entities.CustomPage.update(page.id, data);
      } else {
        return base44.entities.CustomPage.create(data);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customPages'] });
      alert(`Page ${page?.id ? 'updated' : 'created'} successfully!`);
      onSuccess(data); // Pass the saved page data
    },
    onError: (error) => {
      console.error("Failed to save page:", error);
      alert("Failed to save page.");
    }
  });

  const handleTitleChange = (title) => {
    setFormData(prev => ({
      ...prev,
      title: title,
      slug: generateSlug(title) // Automatically update slug
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Assuming base44.storage.uploadFile returns a URL or path
      const result = await base44.storage.uploadFile(file); // Adjust as per actual base44 API
      setFormData(prev => ({ ...prev, featured_image: result.url || result.path })); // Or however the URL is returned
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.slug) {
      alert("Title, Slug, and Content are required");
      return;
    }

    const dataToSave = {
      ...formData,
      author_email: authorEmail, // Ensure author_email is always set
    };

    await saveMutation.mutateAsync(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <Label htmlFor="pageTitle">Page Title *</Label>
        <Input
          id="pageTitle"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter page title"
          required
          className="text-2xl font-bold h-auto py-4"
        />
      </div>

      {/* Slug */}
      <div>
        <Label htmlFor="pageSlug">URL Slug *</Label>
        <Input
          id="pageSlug"
          value={formData.slug}
          onChange={(e) => setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
          placeholder="url-friendly-slug"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          URL: /page?slug={formData.slug}
        </p>
      </div>

      {/* Content */}
      <div>
        <Label htmlFor="pageContent">Content *</Label>
        <div className="mt-2 border rounded-lg overflow-hidden">
          <ReactQuill
            id="pageContent"
            theme="snow"
            value={formData.content}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean'],
              ],
            }}
            className="bg-white min-h-[400px]"
          />
        </div>
      </div>

      {/* Featured Image */}
      <div>
        <Label htmlFor="featuredImageUpload">Featured Image</Label>
        <div className="space-y-2">
          <input
            id="featuredImageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#15B46A] file:text-white hover:file:bg-[#0F9456]"
          />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
          {formData.featured_image && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden group mt-2">
              <img
                src={formData.featured_image}
                alt="Featured"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Template and Status Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pageTemplate">Template</Label>
          <Select
            id="pageTemplate"
            value={formData.template}
            onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="full-width">Full Width</SelectItem>
              <SelectItem value="landing">Landing Page</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="pageStatus">Status</Label>
          <Select
            id="pageStatus"
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Layout Options */}
      <div className="p-4 bg-blue-50 rounded-lg space-y-4">
        <h3 className="font-semibold text-gray-900 text-lg">Layout Settings</h3>

        <div className="flex items-center gap-3">
          <Switch
            id="useGlobalLayout"
            checked={formData.use_global_layout}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, use_global_layout: checked }))}
          />
          <div>
            <Label htmlFor="useGlobalLayout">Use Global Header & Footer</Label>
            <p className="text-xs text-gray-600">
              Enable to show the site's header and footer on this page
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="showInMenu"
            checked={formData.show_in_menu}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_in_menu: checked }))}
          />
          <Label htmlFor="showInMenu">Show in Navigation Menu</Label>
        </div>

        <div>
          <Label htmlFor="menuOrder">Menu Order</Label>
          <Input
            id="menuOrder"
            type="number"
            value={formData.menu_order}
            onChange={(e) => setFormData(prev => ({ ...prev, menu_order: parseInt(e.target.value) || 0 }))}
            className="w-32"
          />
        </div>
      </div>

      {/* SEO Fields */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 text-lg">SEO Settings</h3>

        <div>
          <Label htmlFor="seoTitle">SEO Title</Label>
          <Input
            id="seoTitle"
            value={formData.seo_title}
            onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
            placeholder="SEO optimized title"
          />
        </div>

        <div>
          <Label htmlFor="seoDescription">SEO Description</Label>
          <Textarea
            id="seoDescription"
            value={formData.seo_description}
            onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
            placeholder="Meta description for search engines"
            rows={2}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => onSuccess(null)} disabled={saveMutation.isPending}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#15B46A] hover:bg-[#0F9456]"
          disabled={saveMutation.isPending || !formData.title || !formData.slug || !formData.content}
        >
          {saveMutation.isPending ? 'Saving...' : page ? 'Update Page' : 'Create Page'}
        </Button>
      </div>
    </form>
  );
}

export default function PageEditor() {
  const [user, setUser] = useState(null);
  const [pageId, setPageId] = useState(null);
  const [pageData, setPageData] = useState(null); // State to hold fetched page data

  useEffect(() => {
    loadUser();
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setPageId(id);
      loadPage(id);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      window.location.href = createPageUrl("Home"); // Redirect on auth failure
    }
  };

  const loadPage = async (id) => {
    try {
      const pages = await base44.entities.CustomPage.list();
      const page = pages.find(p => p.id === id);
      if (page) {
        setPageData(page);
      } else {
        console.error("Page not found:", id);
        setPageData(null); // Clear data if not found
      }
    } catch (error) {
      console.error("Error loading page:", error);
      setPageData(null); // Clear data on error
    }
  };

  const handleFormSuccess = (savedPage) => {
    // Redirect to the newly created/updated page or admin panel
    if (savedPage && savedPage.slug) {
      window.location.href = createPageUrl(`Page?slug=${savedPage.slug}`);
    } else {
      window.location.href = createPageUrl("AdminPanel"); // Default fallback
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
      </div>
    );
  }

  // If pageId exists but pageData is null (still loading or not found), show loader
  if (pageId && pageData === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => window.location.href = createPageUrl("AdminPanel")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {pageId ? 'Edit Page' : 'Create New Page'}
            </h1>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <PageForm
              page={pageData} // Pass the fetched page data to the form
              authorEmail={user.email} // Pass the user's email
              onSuccess={handleFormSuccess} // Callback for after successful save
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
