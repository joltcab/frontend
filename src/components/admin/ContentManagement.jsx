import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, File, FolderOpen, Tag } from "lucide-react";
import BlogManager from "./content/BlogManager";
import EventManager from "./content/EventManager";
import PageManager from "./content/PageManager";
import CategoryManager from "./content/CategoryManager";
import TagManager from "./content/TagManager";

export default function ContentManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Content Management</h2>
        <p className="text-gray-600 mt-1">Manage your blog posts, events, and custom pages</p>
      </div>

      <Tabs defaultValue="blog" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="blog" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Blog</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <File className="w-4 h-4" />
            <span className="hidden sm:inline">Pages</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span className="hidden sm:inline">Tags</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>

          <TabsContent value="events">
            <EventManager />
          </TabsContent>

          <TabsContent value="pages">
            <PageManager />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="tags">
            <TagManager />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}