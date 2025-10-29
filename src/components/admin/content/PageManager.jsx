import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Search, FileText, Loader2 } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function PageManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['customPages'],
    queryFn: () => base44.entities.CustomPage.list('-menu_order'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CustomPage.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customPages'] }),
  });

  const filteredPages = pages.filter(page => 
    page.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => window.location.href = createPageUrl("PageEditor")}
          className="bg-[#15B46A] hover:bg-[#0F9456]"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Page
        </Button>
      </div>

      {filteredPages.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No pages yet</h3>
            <p className="text-gray-600 mb-6">Create custom pages for your website</p>
            <Button
              onClick={() => window.location.href = createPageUrl("PageEditor")}
              className="bg-[#15B46A] hover:bg-[#0F9456]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Page
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPages.map((page) => (
            <Card key={page.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{page.title}</h3>
                      <Badge className={page.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {page.status}
                      </Badge>
                      {page.show_in_menu && (
                        <Badge className="bg-blue-100 text-blue-800">In Menu</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Template: {page.template} • Order: {page.menu_order}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.location.href = createPageUrl(`PageEditor?id=${page.id}`)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.location.href = createPageUrl(`Page?slug=${page.slug}`)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => {
                          if (confirm(`Delete "${page.title}"?`)) {
                            deleteMutation.mutate(page.id);
                          }
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}