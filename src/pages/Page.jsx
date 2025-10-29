import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

export default function Page() {
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const slugParam = urlParams.get('slug');
    setSlug(slugParam);
  }, []);

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['customPages'],
    queryFn: () => base44.entities.CustomPage.filter({ status: 'published' }),
  });

  const page = pages.find(p => p.slug === slug || p.id === slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Si use_global_layout es false, mostrar solo el contenido sin Header/Footer
  // (el Layout.js ya los agregará automáticamente si use_global_layout es true)
  
  return (
    <div className={page.template === 'full-width' ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'}>
      {page.featured_image && (
        <div className="mb-8">
          <img
            src={page.featured_image}
            alt={page.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>
      )}

      <article>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {page.title}
        </h1>

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
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </div>
  );
}